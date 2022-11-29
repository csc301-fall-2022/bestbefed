import { Request, Response } from "express";
import validator from "validator";
import { AppDataSource } from "../data-source";
import { StoreErrors, StoreRequest, StoreInfo } from "./interfaces";
import { Store } from "../entity/Store";
import bcrypt from "bcryptjs";
import { Point } from "geojson";
import jwt from "jsonwebtoken";
import distance from "@turf/distance";
import { ILike } from "typeorm";

// Create a store repository that allows us to use TypeORM to interact w/ Store entity in DB.
const storeRepository = AppDataSource.getRepository(Store);

/**
 * Handles POST store/ and attempts to create new Store in database.
 *
 * @param {Request}  req   Express.js object that contains all data pertaining to the POST request.
 * @param {Response} res   Express.js object that contains all data and functions needed to send response to client.
 *
 * @return {null}          Simply sends response back to client to notify of success or failure.
 */
export const createStore = async (req: Request, res: Response) => {
  try {
    const storeData: StoreRequest = {
      storeName: (<any>req.body).storeName.trim(),
      password: (<any>req.body).password.trim(),
      email: (<any>req.body).email.trim(),
      address: (<any>req.body).address.trim(),
    };
    const store = await cleanStore(storeData);

    // Do not proceed with store creation if there are errors with entered data.
    if (isStoreErrors(store)) {
      // Send back a 400 response to acknowledge register attempt but send back errors
      return res.status(400).send({ errors: store });
    }

    // All store data was valid - store will now be created properly.
    const salt = bcrypt.genSaltSync(10);
    const hashedPass = bcrypt.hashSync(store.password, salt);

    const newStore: Store = new Store();
    const location: Point = {
      type: "Point",
      coordinates: [125.6, 10.1],
    };
    newStore.store_name = store.storeName;
    newStore.email = store.email;
    newStore.address = store.address;
    newStore.create_date = new Date();
    newStore.password = hashedPass;
    newStore.email_verified = false;
    newStore.location = location;

    await storeRepository.save(newStore);

    // Send back 201 upon successful creation
    res.status(201).json("New store created.");
  } catch (err) {
    res.status(500).send(err);
  }
};

/**
 * Handles POST store/ and attempts to create new Store in database.
 *
 * @param {Request}  req   Express.js object that contains all data pertaining to the POST request.
 * @param {Response} res   Express.js object that contains all data and functions needed to send response to client.
 *
 * @return {null}          Simply sends response back to client to notify of success or failure.
 */
export const fetchStores = async (req: Request, res: Response) => {
  try {
    const user_location: number[] = (<any>req.body).location;

    // Takes the URL value tagged by "storeName"
    const requested_store_name: string = (<any>req.query).storeName;
    // if the user did not add "storeName" tag to URL as a filter
    if (!requested_store_name) {
      // get the stores from database
      const stores: Store[] | null = await storeRepository.find();
      const storeInfo: StoreInfo[] = stores.map((store) => {
        return <StoreInfo>{
          storeName: store.store_name,
          address: store.address,
          distance: distance(user_location, store.location.coordinates),
        };
      });
      res.status(200).json(storeInfo);
    } else {
      // if the user did add "storeName" tag to URL as a filter
      const stores: Store[] = await storeRepository.findBy({
        store_name: ILike(`%${requested_store_name}%`),
      });
      const storeInfo: StoreInfo[] = stores.map((store) => {
        return <StoreInfo>{
          storeName: store.store_name,
          address: store.address,
          distance: distance(user_location, store.location.coordinates),
        };
      });
      res.status(200).json(storeInfo);
    }
  } catch (err) {
    res.status(500).send(err);
  }
};

/**
 * Handles POST store/login and attempts to log in and authenticate a store.
 *
 * @param {Request}  req   Express.js object that contains all data pertaining to the POST request.
 * @param {Response} res   Express.js object that contains all data and functions needed to send response to client.
 *
 * @return {null}          Simply sends response back to client to notify of success or failure.
 */
export const loginStore = async (req: Request, res: Response) => {
  try {
    // Try to query store based on storename
    const store = await storeRepository.findOneBy({
      store_name: req.body.storeName,
    });
    if (!store) {
      return res.status(404).json("Store does not exist");
    }

    // If store exists, verify password is correct.
    const validPassword = await bcrypt.compare(
      req.body.password,
      store.password
    );
    if (!validPassword) {
      return res.status(400).json("Password is incorrect");
    }

    // Create the JWT to provide store with authentication.
    const payload = {
      type: "store",
      id: store.store_id,
    };
    const token = jwt.sign(
      payload,
      <string>(
        (process.env.PRODUCTION == "true"
          ? process.env.SECRET
          : "hellomyfriend")
      ),
      {
        expiresIn: "1d",
      }
    );
    res
      .cookie("access_token", token, {
        httpOnly: false,
      })
      .status(200)
      .json({
        storeName: store.store_name,
      });
  } catch (err) {
    res.status(500).send(err);
  }
};

/**
 * Handles GET store/logout and attempts to log the store out of their session.
 *
 * @param {Request}  req   Express.js object that contains all data pertaining to the GET request.
 * @param {Response} res   Express.js object that contains all data and functions needed to send response to client.
 *
 * @return {null}          Simply sends response back to client to notify of success or failure after trying to clear cookie.
 */
export const logoutStore = (req: Request, res: Response) => {
  res.clearCookie("access_token");
  res.status(200).send("Logged out!");
};

// Helper functions
const isStoreErrors = (obj: any) => {
  return "numErrors" in obj;
};

/**
 * Takes in the request body of a "create store" request, validates and sanitizes the data.
 *
 * @param {StoreRequest}  store   Object containing store data from Store sign-up form.
 *
 * @return {StoreRequest | StoreErrors } Validated.
 */
const cleanStore = async (newStore: StoreRequest) => {
  // consider implementing try-catch?
  // Takes in the request body of a "create store" request, validates and sanitizes the data
  const errors: StoreErrors = {
    numErrors: 0,
    storeName: "",
    password: "",
    email: "",
    address: "",
  };

  // Check if a store with this name already exists in the database
  const existingStore: Store | null = await storeRepository.findOneBy({
    store_name: newStore.storeName,
  });

  if (existingStore) {
    errors.numErrors += 1;
    errors["storeName"] = "StoreName already exists! Please sign in.";
  }

  // Verify that password is strong enough
  if (!validator.isStrongPassword(newStore.password)) {
    errors.numErrors += 1;
    errors["password"] =
      "Password is too weak! You need to have at least 8 characters with 1 uppercase, 1 lowercase, 1 number, and 1 symbol!";
  }

  // Check for valid email address
  if (!validator.isEmail(newStore.email)) {
    errors.numErrors += 1;
    errors["email"] = "Please enter a valid email address.";
  }

  // TODO: maybe make a better validation for address
  // Check for valid email address
  if (validator.isEmpty(newStore.address)) {
    errors.numErrors += 1;
    errors["address"] = "Please enter an address.";
  }

  // Needs to return either the cleaned user or errors dictionary
  if (errors.numErrors) {
    return errors;
  } else {
    return newStore;
  }
};
