import bcrypt from "bcryptjs";
import express, { Request, Response } from "express";
import jwt from "jsonwebtoken";
import validator from "validator";

import { AppDataSource } from "../data-source";
import { PaymentInfo, UserErrors, UserRequest } from "./interfaces";
import { Order } from "../entity/Order";
import { InventoryItem } from "../entity/InventoryItem";
import { User } from "../entity/User";
// import { DataSource } from "typeorm";

// Create a user repository that allows us to use TypeORM to interact w/ User entities in DB.
const userRepository = AppDataSource.getRepository(User);

// Helper functions
const isUserErrors = (obj: any) => {
  return "numErrors" in obj;
};

/**
 * Takes in the request body of a "create user" request, validates and sanitizes the data.
 *
 * @param {UserRequest}  user   Object containing user data from User sign-up form.
 *
 * @return {userRequest | userErrors } Validated.
 */
const cleanUser = async (newUser: UserRequest) => {
  // consider implementing try-catch?
  // Takes in the request body of a "create user" request, validates and sanitizes the data
  const errors: UserErrors = {
    numErrors: 0,
    username: "",
    password: "",
    firstName: "",
    lastName: "",
    email: "",
    paymentInfo: [],
  };
  // Check if a user with this username exists in the database
  const existingUser: User | null = await userRepository.findOneBy({
    username: newUser.username,
  });
  if (existingUser) {
    errors.numErrors += 1;
    errors["username"] =
      "Username already exists! Please choose something else.";
  }

  // Verify that password is strong enough
  if (!validator.isStrongPassword(newUser.password)) {
    errors.numErrors += 1;
    errors["password"] =
      "Password is too weak! You need to have at least 8 characters with 1 uppercase, 1 lowercase, 1 number, and 1 symbol!";
  }

  // Check for valid email address
  if (!validator.isEmail(newUser.email)) {
    errors.numErrors += 1;
    errors["email"] = "Please enter a valid email address.";
  }

  // Check that first and last names aren't empty
  if (newUser.firstName.length == 0) {
    errors.numErrors += 1;
    errors["firstName"] = "Please enter your first name.";
  }
  if (newUser.lastName.length == 0) {
    errors.numErrors += 1;
    errors["lastName"] = "Please enter your last name.";
  }

  // Check that every piece of the payment info is valid (if provided)
  if (
    newUser.paymentInfo.creditCard ||
    newUser.paymentInfo.cvv ||
    newUser.paymentInfo.expiryDate
  ) {
    if (!validator.isCreditCard(newUser.paymentInfo.creditCard)) {
      errors.numErrors += 1;
      errors["paymentInfo"].push("Please enter a valid credit card number!");
    }
    //   if (!validator.isDate(newUser.paymentInfo.expiryDate)) {
    //     errors["paymentInfo"].push("Please enter a valid card expiry date!");
    //   }
    if (
      newUser.paymentInfo.cvv.length != 3 ||
      !validator.isNumeric(newUser.paymentInfo.cvv)
    ) {
      errors.numErrors += 1;
      errors["paymentInfo"].push(
        "Please enter a valid CVV code for your credit card."
      );
    }
  }

  // Needs to return either the cleaned user or errors dictionary
  if (errors.numErrors) {
    return errors;
  } else {
    return newUser;
  }
};

/**
 * Takes in the request data of a "create user" request.
 *
 * @param {Request}  requestBody   Object containing request data from sign-in form.
 *
 * @return { UserRequest }
 */
const constructUserRequest = async (requestBody: Request) => {
  const userData: UserRequest = {
    username: (<any>requestBody.body).username.trim(),
    password: (<any>requestBody.body).password.trim(),
    firstName: (<any>requestBody.body).firstName.trim(),
    lastName: (<any>requestBody.body).lastName.trim(),
    email: (<any>requestBody.body).email.trim(),
    paymentInfo: {
      creditCard: (<any>requestBody.body).paymentInfo.creditCard.trim(),
      expiryDate: (<any>requestBody.body).paymentInfo.expiryDate,
      cvv: (<any>requestBody.body).paymentInfo.cvv.trim(),
    },
  };
  return userData;
};

/**
 * Handles POST user/ and attempts to create new User in database.
 *
 * @param {Request}  req   Express.js object that contains all data pertaining to the POST request.
 * @param {Response} res   Express.js object that contains all data and functions needed to send response to client.
 * @param {DataSource} repo   typeorm db.
 *
 * @return {null}          Simply sends response back to client to notify of success or failure.
 */
export const createUser = async (req: Request, res: Response) => {
  try {
    // Try validating the data entered for the new user.
    const userData = await constructUserRequest(req);
    const user = await cleanUser(userData);

    // Do not proceed with user creation if there are errors with entered data.
    if (isUserErrors(user)) {
      // Send back a 400 response to acknowledge register attempt but send back errors
      return res.status(400).send({ errors: user });
    }

    // All user data was valid - user will now be created properly.
    const salt = bcrypt.genSaltSync(10);
    const hashedPass = bcrypt.hashSync(user.password, salt);

    const newUser: User = new User();
    newUser.username = user.username;
    newUser.firstName = user.firstName;
    newUser.lastName = user.lastName;
    newUser.email = user.email;
    newUser.password = hashedPass;
    newUser.email_verified = false;
    newUser.create_date = new Date();
    newUser.payment_info = <any>user.paymentInfo; // this is bad practice - but we know it'll implement the interface if we get here

    await userRepository.save(newUser);

    // Send back 201 upon successful creation
    res.status(201).json("New user created.");
  } catch (err) {
    res.status(500).send(err);
  }
};

/**
 * Handles POST user/login and attempts to log in and authenticate a user.
 *
 * @param {Request}  req   Express.js object that contains all data pertaining to the POST request.
 * @param {Response} res   Express.js object that contains all data and functions needed to send response to client.
 *
 * @return {null}          Simply sends response back to client to notify of success or failure.
 */
export const loginUser = async (req: Request, res: Response) => {
  try {
    // Try to query and store user corresponding to entered username.
    const user = await userRepository.findOneBy({
      username: req.body.username,
    });
    if (!user) {
      return res.status(404).json("User does not exist");
    }

    // If user existed, verify password is correct.
    const validPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!validPassword) {
      return res.status(400).json("Password is incorrect");
    }

    // Create the JWT to provide user with authentication.
    const payload = {
      type: "user",
      id: user.user_id,
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
        token: token,
        expiresIn: "1440",
        authUserState: {
          username: user.username,
          email: user.email,
        },
      });
  } catch (err) {
    res.status(500).send(err);
  }
};

/**
 * Handles GET user/logout and attempts to log the user out of their session.
 *
 * @param {Request}  req   Express.js object that contains all data pertaining to the GET request.
 * @param {Response} res   Express.js object that contains all data and functions needed to send response to client.
 *
 * @return {null}          Simply sends response back to client to notify of success or failure after trying to clear cookie.
 */
export const logoutUser = (req: Request, res: Response) => {
  res.clearCookie("access_token");
  res.status(200).send("Logged out!");
};
