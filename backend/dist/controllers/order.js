"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createOrder = void 0;
const data_source_1 = require("../data-source");
// Entity Imports
const CartItem_1 = require("../entity/CartItem");
const Order_1 = require("../entity/Order");
const User_1 = require("../entity/User");
const InventoryItem_1 = require("../entity/InventoryItem");
var today = new Date();
// Relevant repository setup
const cartRepository = data_source_1.AppDataSource.getRepository(CartItem_1.CartItem);
const userRepository = data_source_1.AppDataSource.getRepository(User_1.User);
const inventoryRepository = data_source_1.AppDataSource.getRepository(InventoryItem_1.InventoryItem);
const orderRepository = data_source_1.AppDataSource.getRepository(Order_1.Order);
/**
 * Handles POST requests to `/order/add` and attempts to create a new Order in the database.
 * This method will take the current User's cart items, convert them to
 *
 * @param {Request}  req   Express.js object that contains all data pertaining to the POST request.
 * @param {Response} res   Express.js object that contains all data and functions needed to send response to client.
 *
 * @return {string}        Simply sends response back to client to notify if success or specifies the error
 */
const createOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(document.cookie);
    try {
        // Attempt to get user ID from cookies
        //let userId: string = (<any>req).user.id;
        let userId = req.user.id;
        if (!userId) {
            return res.status(400).json("User not specified");
        }
        const user = yield userRepository.findOneBy({
            user_id: userId,
        });
        if (!user) {
            return res.status(404).json("User not found");
        }
        // At this point, user should be the currently authenticated user.
        const orderData = {
            order_date: today,
            customer: user.user_id // TODO: get current logged in User object
        };
        return res.status(201).json("New order successfully created for " + user.username);
    }
    catch (err) {
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
});
exports.createOrder = createOrder;
