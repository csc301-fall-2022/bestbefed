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
exports.listCartItem = exports.updateCartQuantity = exports.removeCartItem = exports.addCartItem = void 0;
const data_source_1 = require("../data-source");
const CartItem_1 = require("../entity/CartItem");
const User_1 = require("../entity/User");
const Inventory_1 = require("../entity/Inventory");
const typeorm_1 = require("typeorm");
// Create multiple repositories that allows us to use TypeORM to interact w/ entities in DB.
const cartRepository = data_source_1.AppDataSource.getRepository(CartItem_1.CartItem);
const userRepository = data_source_1.AppDataSource.getRepository(User_1.User);
const inventoryRepository = data_source_1.AppDataSource.getRepository(Inventory_1.Inventory);
/**
 * Handles POST store/ and attempts to create new Store in database.
 *
 * @param {Request}  req   Express.js object that contains all data pertaining to the POST request.
 * @param {Response} res   Express.js object that contains all data and functions needed to send response to client.
 *
 * @return {null}          Simply sends response back to client to notify of success or failure.
 */
const addCartItem = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Attempt to get user ID from cookies
        //let userId: string = (<any>req).user.id;
        let userId = req.body.user;
        if (!userId) {
            // user ID not specified in URL query params
            // Grab the user's uuid from the payload of the token held by the cookie
            userId = req.body.user;
        }
        const user = yield userRepository.findOneBy({
            user_id: userId,
        });
        if (!user) {
            return res.status(404).json("User not found");
        }
        // Clean the fields of the item's data, we only need quantity rn but may need more later
        const cartItem = cleanFields(req.body);
        const inventoryItem = yield inventoryRepository.findOneBy({
            item_id: (0, typeorm_1.Equal)(cartItem.inventoryItemId),
        });
        if (!inventoryItem) {
            return res.status(404).json("The item was not found in inventory");
        }
        const newCartItem = new CartItem_1.CartItem();
        newCartItem.customer = user;
        newCartItem.quantity = cartItem.quantity;
        newCartItem.added_date = new Date();
        newCartItem.cart_item = inventoryItem;
        yield cartRepository.save(newCartItem);
        // re-calculate the total for the cart
        // var total: number = (<any>req).total;
        // total +=
        //   newCartItem.cart_item.price.valueOf() *
        //   newCartItem.cart_item.quantity.valueOf();
        // Send back 201 upon successful creation
        res.status(201).json("New item successfully created");
    }
    catch (err) {
        res.status(500).send(err);
    }
});
exports.addCartItem = addCartItem;
/**
 * Handles POST store/ and attempts to create new Store in database.
 *
 * @param {Request}  req   Express.js object that contains all data pertaining to the POST request.
 * @param {Response} res   Express.js object that contains all data and functions needed to send response to client.
 *
 * @return {null}          Simply sends response back to client to notify of success or failure.
 */
const removeCartItem = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const clearAll = req.params.clearAll === "true";
        // Attempt to get user ID from cookies
        //let userId: string = (<any>req).user.id;
        let userId = req.body.user;
        if (!userId) {
            // user ID not specified in URL query params
            // Grab the user's uuid from the payload of the token held by the cookie
            userId = req.body.user;
        }
        // If the request is to clear all of the items, then do so
        if (clearAll) {
            yield cartRepository.delete({ customer: { user_id: userId } });
            return res.status(200).json("The cart was fully cleared");
        }
        // Get the item that the store manager is trying to delete.
        const cartItemId = parseInt(req.params.cartItemId);
        // check that the item belongs to the user
        const isValid = yield isValidItem(cartItemId, userId);
        if (!isValid) {
            return res
                .status(404)
                .json("Cart item does not exist or does not belong to the correct user");
        }
        // calculating the total
        // var total: number = (<any>req).total;
        // var price: number = (<any>req).price;
        // total = total - price;
        yield cartRepository.delete(cartItemId);
        res.status(200).json("The item was sucessfully deleted");
    }
    catch (err) {
        res.status(500).send(err);
    }
});
exports.removeCartItem = removeCartItem;
/**
 * Handles POST store/ and attempts to create new Store in database.
 *
 * @param {Request}  req   Express.js object that contains all data pertaining to the POST request.
 * @param {Response} res   Express.js object that contains all data and functions needed to send response to client.
 *
 * @return {null}          Simply sends response back to client to notify of success or failure.
 */
const updateCartQuantity = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Attempt to get user ID from cookies
        //let userId: string = (<any>req).user.id;
        let userId = req.body.user;
        if (!userId) {
            // user ID not specified in URL query params
            // Grab the user's uuid from the payload of the token held by the cookie
            userId = req.body.user;
        }
        const cartItemId = parseInt(req.params.cartItemId);
        // Make sure that this item belongs to the store
        const isValid = yield isValidItem(cartItemId, userId);
        if (!isValid) {
            return res
                .status(404)
                .json("Cart item does not exist or does not belong to the correct user");
        }
        // PATCH request body contains the quantity that we want to update
        const patchBody = {};
        if ("quantity" in req.body) {
            patchBody.quantity = req.body.quantity;
        }
        yield cartRepository.update(cartItemId, patchBody);
        // update the total cost
        // var total: number = (<any>req).total;
        // var price: number = (<any>req).price;
        // var difference = (<any>req).oldQuantity - (<any>req).newQuantity;
        // total += difference * price;
        res.status(200).json("The item was updated successfully");
    }
    catch (err) {
        res.status(500).send(err);
    }
});
exports.updateCartQuantity = updateCartQuantity;
/**
 * Handles POST store/login and attempts to log in and authenticate a store.
 *
 * @param {Request}  req   Express.js object that contains all data pertaining to the POST request.
 * @param {Response} res   Express.js object that contains all data and functions needed to send response to client.
 *
 * @return {null}          Simply sends response back to client to notify of success or failure.
 */
const listCartItem = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Attempt to get user ID from cookies
        //let userId: string = (<any>req).user.id;
        let userId = req.body.user;
        if (!userId) {
            // user ID not specified in URL query params
            // Grab the user's uuid from the payload of the token held by the cookie
            userId = req.body.user;
        }
        if (!userId) {
            return res.status(400).json("User not specified");
        }
        var total = 0;
        // Query for all the items in the cart for this user.
        const user = yield userRepository.findOneBy({
            username: "testyt3",
        });
        const cartItems = yield cartRepository.find({
            relations: ["customer", "cart_item", "cart_item.store"],
            where: {
                customer: {
                    user_id: user === null || user === void 0 ? void 0 : user.user_id, // Syntax for querying for an item based on elements of embedded entities/FK relations
                },
            },
        });
        // Convert returned CartItem objects to format expected by frontend.
        const cartInfo = cartItems.map((item) => {
            total += item.quantity.valueOf() * item.cart_item.price.valueOf();
            return {
                cart_item_id: item.item_id.valueOf(),
                name: item.cart_item.item_name,
                quantity: item.quantity.valueOf(),
                price: item.cart_item.price.valueOf(),
                store: item.cart_item.store.store_name,
                inventory_item: item.cart_item.item_id.valueOf(),
            };
        });
        cartInfo.push(total);
        res.status(200).json(cartInfo);
    }
    catch (err) {
        res.status(500).send(err);
    }
});
exports.listCartItem = listCartItem;
/**
 * HELPER: checks that the item exists and belongs to the user that is passed in
 *
 * @param {number} cartItemId       the id of the item that is being checked
 *
 * @param {string} userId           the id of the user that the item is supposed to belong to
 *
 * @return {boolean}              whether the item exists and belongs to the correct user or not.
 */
const isValidItem = (cartItemId, userId) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const cartItem = yield cartRepository.find({
        relations: ["customer"],
        where: {
            item_id: (0, typeorm_1.Equal)(Number(cartItemId)), // Syntax for querying for an item based on elements of embedded entities/FK relations
        },
    });
    if (cartItem.length === 0) {
        return false;
    }
    if (((_a = cartItem[0]) === null || _a === void 0 ? void 0 : _a.customer.user_id) !== userId) {
        console.log("here");
        return false;
    }
    return true;
});
/**
 * HELPER: sanitizes all the fields in an object of type ItemInfo to prepare it for creation in Database.
 *
 * @param {ItemInfo} itemData       Object containing unsanitized data needed for the creation of an InventoryItem entity.
 *
 * @return {ItemInfo}               A sanitized ItemInfo object.
 */
const cleanFields = (cartItemData) => {
    if ("quantity" in cartItemData) {
        cartItemData["quantity"] = Math.round(cartItemData["quantity"]);
    }
    if ("inventoryItemId" in cartItemData) {
        cartItemData["inventoryItemId"] = cartItemData["inventoryItemId"];
    }
    return cartItemData;
};
