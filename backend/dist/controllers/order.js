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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cancelOrder = exports.createOrder = void 0;
// Library imports/data
const axios_1 = __importDefault(require("axios"));
const a = axios_1.default.create({
    baseURL: process.env.NODE_ENV === "production"
        ? "https://app.bestbefed.ca"
        : "http://localhost:8000",
});
const data_source_1 = require("../data-source");
const typeorm_1 = require("typeorm");
// Entity Imports
const CartItem_1 = require("../entity/CartItem");
const Order_1 = require("../entity/Order");
const OrderedItem_1 = require("../entity/OrderedItem");
const User_1 = require("../entity/User");
const InventoryItem_1 = require("../entity/InventoryItem");
// Relevant repository setup
const storeInventoryRepository = data_source_1.AppDataSource.getRepository(InventoryItem_1.InventoryItem);
const cartRepository = data_source_1.AppDataSource.getRepository(CartItem_1.CartItem);
const userRepository = data_source_1.AppDataSource.getRepository(User_1.User);
const orderRepository = data_source_1.AppDataSource.getRepository(Order_1.Order);
const orderedItemsRepository = data_source_1.AppDataSource.getRepository(OrderedItem_1.OrderedItem);
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
    try {
        // Attempt to get user ID from cookies
        // const userId: string = (<any>req).user.id
        const userId = req.user.id;
        if (!userId) {
            return res.status(400).json("User not specified");
        }
        const user = yield userRepository.findOneBy({
            user_id: userId,
        });
        if (!user) {
            return res.status(404).json("User not found");
        }
        // find the items by the user
        var cartItems = yield cartRepository.find({
            relations: ["customer", "cart_item", "cart_item.store"],
            where: {
                customer: {
                    user_id: user === null || user === void 0 ? void 0 : user.user_id,
                },
            },
        });
        if (cartItems.length == 0) {
            return res.status(400).json("No items in cart to create order.");
        }
        const orderData = {
            order_date: new Date(),
            customer: user
        };
        // Construct the newOrder object.
        const newOrder = new Order_1.Order();
        // Set today's date to the order date.
        newOrder.order_date = orderData["order_date"];
        // Set customer to the logged-in user.
        newOrder.customer = orderData["customer"];
        // Save this newOrder object in the orderRepository
        yield orderRepository.save(newOrder);
        // console.log("Adding this many items to Order! " + cartItems.length);
        // Go through each item in the CartItems and check if stores have enough inventory to allow for this order.
        for (let i = 0; i < cartItems.length; i++) {
            // Check if cartItems.cart_item.quantity ("requested item in cart's store inventory quantity")
            // is greater than cartItems.quantity ("requested item in cart's quantity")
            if (cartItems[i].cart_item.quantity < cartItems[i].quantity) {
                return res.status(400).json("The store(s) do not have the requested inventory to make this order.");
            }
        }
        // At this point, we can proceed with the order creation.
        // Go through each item in the CartItems and add it to newOrderedItem and link it to the newOrder.
        for (let i = 0; i < cartItems.length; i++) {
            // Construct the OrderedItem
            const newOrderedItem = new OrderedItem_1.OrderedItem();
            newOrderedItem.order = newOrder;
            newOrderedItem.inventory_item = cartItems[i].cart_item;
            newOrderedItem.quantity = cartItems[i].quantity;
            yield orderedItemsRepository.save(newOrderedItem);
            // Decrement the store's quantity
            // Construct the partial object:
            var tempStoreItem = new InventoryItem_1.InventoryItem();
            tempStoreItem.quantity = (cartItems[i].cart_item.quantity - cartItems[i].quantity);
            // Update the store inventory repo given the number id and the field to augment.
            yield storeInventoryRepository.update(cartItems[i].cart_item.item_id, tempStoreItem);
        }
        yield cartRepository.delete({ customer: { user_id: userId } });
        return res.status(201).json("New order successfully made for " + user.username + " at " + newOrder.order_date);
    }
    catch (err) {
        return res.status(500).send(err);
    }
});
exports.createOrder = createOrder;
/**
 * Handles POST requests to `/order/add` and attempts to create a new Order in the database.
 * This method will take the current User's cart items, convert them to
 *
 * @param {Request}  req   Express.js object that contains all data pertaining to the POST request.
 * @param {Response} res   Express.js object that contains all data and functions needed to send response to client.
 *
 * @return {string}        Simply sends response back to client to notify if success or specifies the error
 */
const cancelOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Attempt to get user ID from cookies
        // const userId: string = (<any>req).user.id
        const userId = req.user.id;
        if (!userId) {
            return res.status(400).json("User not specified");
        }
        const user = yield userRepository.findOneBy({
            user_id: userId,
        });
        if (!user) {
            return res.status(404).json("User not found");
        }
        // find the items by the user
        // Clean the fields of the item's data, we only need quantity rn but may need more later
        if (req.body["orderId"] == undefined) {
            return res.status(400).json("No order provided.");
        }
        const orderToCancel = yield orderRepository.findOneBy({
            order_id: (0, typeorm_1.Equal)(req.body["orderId"]),
            customer: (0, typeorm_1.Equal)(user.user_id)
        });
        if (!orderToCancel) {
            return res.status(404).json("The order requested was not found in our database.");
        }
        // At this point, we have a valid orderToCancel object of type Order
        // Query for the orderedItems[] part of the given requested orderToCancel
        var orderedItems = yield orderedItemsRepository.find({
            relations: ["order", "inventory_item", "inventory_item.store"],
            where: {
                order: {
                    order_id: orderToCancel === null || orderToCancel === void 0 ? void 0 : orderToCancel.order_id,
                },
            },
        });
        for (let i = 0; i < orderedItems.length; i++) {
            // Increment the store's quantity
            // Construct the partial object:
            var tempStoreItem = new InventoryItem_1.InventoryItem();
            tempStoreItem.quantity = (orderedItems[i].inventory_item.quantity + orderedItems[i].quantity);
            // Update the store inventory repo given the number id and the field to augment.
            yield storeInventoryRepository.update(orderedItems[i].inventory_item.item_id, tempStoreItem);
            // Delete the orderedItem
            yield orderedItemsRepository.delete(orderedItems[i].item_id);
        }
        // Now after wiping all ordered items, we can safely delete the entire Order object from the database:
        yield orderRepository.delete(req.body["orderId"]);
        return res.status(201).json("Order with id: " + req.body["orderId"] + " successfully deleted.");
    }
    catch (err) {
        return res.status(500).send(err);
    }
});
exports.cancelOrder = cancelOrder;
