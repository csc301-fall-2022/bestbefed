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
const InventoryItem_1 = require("../entity/InventoryItem");
const typeorm_1 = require("typeorm");
// Create multiple repositories that allows us to use TypeORM to interact w/ entities in DB.
const cartRepository = data_source_1.AppDataSource.getRepository(CartItem_1.CartItem);
const userRepository = data_source_1.AppDataSource.getRepository(User_1.User);
const inventoryRepository = data_source_1.AppDataSource.getRepository(InventoryItem_1.InventoryItem);
/**
 * Handles POST user/items and attempts to add an item to the user's cart
 *
 * @param {Request}  req   Express.js object that contains all data pertaining to the POST request.
 * @param {Response} res   Express.js object that contains all data and functions needed to send response to client.
 *
 * @return {string}          Simply sends response back to client to notify if success or specifies the error
 */
const addCartItem = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        // Clean the fields of the item's data, we only need quantity rn but may need more later
        const cartItem = cleanFields(req.body);
        const inventoryItem = yield inventoryRepository.findOneBy({
            item_id: (0, typeorm_1.Equal)(cartItem.inventoryItemId),
        });
        if (!inventoryItem) {
            return res.status(404).json("The item was not found in inventory");
        }
        // creates the item and adds it to the database
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
 * Handles DELETE user/items/:cartItemId/:clearAll and attempts to remove 1 or all of the items of a user's cart
 *
 * @param {Request}  req   Express.js object that contains all data pertaining to the POST request.
 * @param {Response} res   Express.js object that contains all data and functions needed to send response to client.
 *
 * @return {String}          Simply sends response back to client to notify if cleared all or cleared 1 or error
 */
const removeCartItem = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const clearAll = req.params.clearAll === "true";
        // Attempt to get user ID from cookies
        //let userId: string = (<any>req).user.id;
        let userId = req.user.id;
        if (!userId) {
            return res.status(400).json("User not specified");
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
 * Handles PATCH user/items/:cartItemId and attempts to update the quantity of a user's item
 *
 * @param {Request}  req   Express.js object that contains all data pertaining to the POST request.
 * @param {Response} res   Express.js object that contains all data and functions needed to send response to client.
 *
 * @return {String}          Simply sends response back to client to notify if success or specifies the error
 */
const updateCartQuantity = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Attempt to get user ID from cookies
        //let userId: string = (<any>req).user.id;
        let userId = req.user.id;
        const cartItemId = parseInt(req.params.cartItemId);
        // Make sure that this item belongs to the store
        if (!userId) {
            return res.status(400).json("User not specified");
        }
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
 * Handles GET user/items and attempts to get all the items from a users cart
 *
 * @param {Request}  req   Express.js object that contains all data pertaining to the POST request.
 * @param {Response} res   Express.js object that contains all data and functions needed to send response to client.
 *
 * @return {Int}          Returns the total price of the list of items
 */
const listCartItem = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Attempt to get user ID from cookies
        //let userId: string = (<any>req).user.id;
        let userId = req.user.id;
        if (!userId) {
            return res.status(400).json("User not specified");
        }
        var total = 0;
        // Query for all the items in the cart for this user.
        const user = yield userRepository.findOneBy({
            user_id: userId,
        });
        // find the items by the user
        const cartItems = yield cartRepository.find({
            relations: ["customer", "cart_item", "cart_item.store"],
            where: {
                customer: {
                    user_id: user === null || user === void 0 ? void 0 : user.user_id,
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
            item_id: (0, typeorm_1.Equal)(Number(cartItemId)),
        },
    });
    if (cartItem.length === 0) {
        return false;
    }
    if (((_a = cartItem[0]) === null || _a === void 0 ? void 0 : _a.customer.user_id) !== userId) {
        return false;
    }
    return true;
});
/**
 * HELPER: sanitizes all the fields in an object of type CleanCartInfo to prepare it for creation in Database.
 *
 * @param {ItemInfo} itemData       Object containing unsanitized data
 *
 * @return {ItemInfo}               A sanitized CleanCartInfo object.
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
