// Library imports/data
import express, { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Equal } from "typeorm";
import validator from "validator";

// Interface Imports
import { OrderRequest } from "./interfaces";
import { CartItemInfo, CleanCartInfo } from "./interfaces";

// Entity Imports
import { CartItem } from "../entity/CartItem";
import { Order } from "../entity/Order";
import { User } from "../entity/User";
import { InventoryItem } from "../entity/InventoryItem";
import { collapseTextChangeRangesAcrossMultipleVersions } from "typescript";

var today = new Date();


// Relevant repository setup
const cartRepository = AppDataSource.getRepository(CartItem);
const userRepository = AppDataSource.getRepository(User);
const inventoryRepository = AppDataSource.getRepository(InventoryItem);
const orderRepository = AppDataSource.getRepository(Order);

/**
 * Handles POST requests to `/order/add` and attempts to create a new Order in the database.
 * This method will take the current User's cart items, convert them to 
 *
 * @param {Request}  req   Express.js object that contains all data pertaining to the POST request.
 * @param {Response} res   Express.js object that contains all data and functions needed to send response to client.
 *
 * @return {string}        Simply sends response back to client to notify if success or specifies the error
 */
export const createOrder = async (req: Request, res: Response) => {
    console.log(document.cookie);
    try {
        // Attempt to get user ID from cookies
        //let userId: string = (<any>req).user.id;
        let userId = (<any>req).user.id;

        if (!userId) {
            return res.status(400).json("User not specified");
        }
        const user: User | null = await userRepository.findOneBy({
            user_id: userId,
        });
        if (!user) {
            return res.status(404).json("User not found");
        }

        // At this point, user should be the currently authenticated user.
        const orderData: OrderRequest = {
            order_date: today,
            customer: user.user_id // TODO: get current logged in User object
        };

        return res.status(201).json("New order successfully created for " + user.username);
    } catch (err) {
        return res.status(500).send(err);
    }
    // try {
    //   const orderData: OrderInfo = {
    //     storeName: (<any>req.body).storeName.trim(),
    //     password: (<any>req.body).password.trim(),
    //     email: (<any>req.body).email.trim(),
    //     address: (<any>req.body).address.trim(),
    //   };
    //   const store = await cleanStore(storeData);
  
    //   // Do not proceed with store creation if there are errors with entered data.
    //   if (isStoreErrors(store)) {
    //     // Send back a 400 response to acknowledge register attempt but send back errors
    //     return res.status(400).send({ errors: store });
    //   }
  
    //   // All store data was valid - store will now be created properly.
    //   const salt = bcrypt.genSaltSync(10);
    //   const hashedPass = bcrypt.hashSync(store.password, salt);
  
    //   const newStore: Store = new Store();
    //   const location: Point = {
    //     type: "Point",
    //     coordinates: [125.6, 10.1],
    //   };
    //   newStore.store_name = store.storeName;
    //   newStore.email = store.email;
    //   newStore.address = store.address;
    //   newStore.create_date = new Date();
    //   newStore.password = hashedPass;
    //   newStore.email_verified = false;
    //   newStore.location = location;
  
    //   await storeRepository.save(newStore);
  
    //   // Send back 201 upon successful creation
    //   res.status(201).json("New store created.");
    // } catch (err) {
    //   res.status(500).send(err);
    // }
};