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
exports.updateInventoryItem = exports.removeInventoryItem = exports.addInventoryItem = exports.listInventory = void 0;
const data_source_1 = require("../data-source");
const Store_1 = require("../entity/Store");
const InventoryItem_1 = require("../entity/InventoryItem");
const storeRepository = data_source_1.AppDataSource.getRepository(Store_1.Store);
const inventoryRepository = data_source_1.AppDataSource.getRepository(InventoryItem_1.InventoryItem);
/**
 * HELPER: sanitizes all the fields in an object of type ItemInfo to prepare it for creation in Database.
 *
 * @param {ItemInfo} itemData       Object containing unsanitized data needed for the creation of an InventoryItem entity.
 *
 * @return {ItemInfo}               A sanitized ItemInfo object.
 */
const cleanFields = (itemData) => {
    if ("name" in itemData) {
        itemData["name"] = itemData["name"].trim();
    }
    if ("price" in itemData) {
        itemData["price"] = parseFloat(itemData["price"].toFixed(2));
    }
    if ("quantity" in itemData) {
        itemData["quantity"] = Math.round(itemData["quantity"]);
    }
    return itemData;
};
/**
 * HELPER: sanitizes all the fields in an object of type ItemInfo to prepare it for creation in Database.
 *
 * @param {ItemInfo} itemData       Object containing unsanitized data needed for the creation of an InventoryItem entity.
 *
 * @return {ItemInfo}               A sanitized ItemInfo object.
 */
const isValidItem = (itemId) => __awaiter(void 0, void 0, void 0, function* () {
    const item = yield inventoryRepository.findOneBy({ item_id: itemId });
    if (!item) {
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
const isOwnedItem = (itemId, storeId) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const item = yield inventoryRepository.findOne({
        relations: {
            store: true,
        },
        where: {
            item_id: itemId,
        },
    });
    if (((_a = item === null || item === void 0 ? void 0 : item.store) === null || _a === void 0 ? void 0 : _a.store_id) !== storeId) {
        return false;
    }
    return true;
});
/**
 * Handles GET request to /stores/items to find and return all items in a store's inventory
 *
 * @param {Request}  req   Express.js object that contains all data pertaining to the POST request.
 * @param {Response} res   Express.js object that contains all data and functions needed to send response to client.
 *
 * @return {null}          Simply sends response back to client to notify of success or failure.
 */
const listInventory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Attempt to get store ID from URL query params
        let storeId = req.query.storeId;
        if (!storeId) {
            // Store ID not specified in URL query params
            // Grab the store's uuid from the payload of the token held by the cookie
            storeId = req.store;
        }
        if (!storeId) {
            return res.status(400).json("Store not specified");
        }
        const store = yield storeRepository.findOneBy({
            store_id: storeId,
        });
        if (!store) {
            return res.status(404).json("Store not found");
        }
        // Query for all the items for this store.
        const items = yield inventoryRepository.find({
            relations: {
                store: true,
            },
            where: {
                store: {
                    store_id: storeId, // Syntax for querying for an item based on elements of embedded entities/FK relations
                },
            },
        });
        // Convert returned InventoryItem objects to format expected by frontend.
        const itemInfo = items.map((item) => {
            return {
                itemId: item.item_id,
                name: item.item_name,
                price: item.price,
                quantity: item.quantity,
            };
        });
        res.status(200).json(itemInfo);
    }
    catch (err) {
        // Shouldn't keep this as a 500 - need a more specific error
        res.status(500).send(err);
    }
});
exports.listInventory = listInventory;
/**
 * Handles POST request to /stores/items/add to add a new item to the inventory of a specific store
 *
 * @param {Request}  req   Express.js object that contains all data pertaining to the POST request.
 * @param {Response} res   Express.js object that contains all data and functions needed to send response to client.
 *
 * @return {null}          Simply sends response back to client to notify of success or failure.
 */
const addInventoryItem = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Get the store whose inventory we are manipulating
        const storeId = req.store.id;
        const store = yield storeRepository.findOneBy({
            store_id: storeId,
        });
        if (!store) {
            return res.status(404).json("Store not found");
        }
        // Clean the fields of the item's data
        const item = cleanFields(req.body);
        // Create and store the item object
        const inventoryItem = new InventoryItem_1.InventoryItem();
        inventoryItem.store = store;
        inventoryItem.item_name = item.name;
        inventoryItem.price = item.price;
        inventoryItem.quantity = item.quantity;
        yield inventoryRepository.save(inventoryItem);
        res.status(201).json("New item added.");
    }
    catch (err) {
        console.log(err);
        res.status(400).json("Item data was invalid.");
    }
});
exports.addInventoryItem = addInventoryItem;
/**
 * Handles DELETE request to /stores/items/:itemId to remove a specific item from the store's inventory
 *
 * @param {Request}  req   Express.js object that contains all data pertaining to the DELETE request.
 * @param {Response} res   Express.js object that contains all data and functions needed to send response to client.
 *
 * @return {null}          Simply sends response back to client to notify of success or failure.
 */
const removeInventoryItem = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Get the item that the store manager is trying to delete.
        const itemId = parseInt(req.params.itemId);
        const validItem = yield isValidItem(itemId);
        if (!validItem) {
            return res.status(404).json("Item not found");
        }
        // Verify that this item is in the inventory of the store making the request
        const storeId = req.store.id;
        const ownedItem = yield isOwnedItem(itemId, storeId);
        if (!ownedItem) {
            return res.status(400).json("Item is invalid.");
        }
        // Remove the item from inventory
        yield inventoryRepository.delete(itemId);
        res.status(200).json("Item deleted successfully.");
    }
    catch (err) {
        res.status(500).json("Something went wrong");
    }
});
exports.removeInventoryItem = removeInventoryItem;
/**
 * Handles PATCH request to /stores/items/:itemId to update a specific item in the store's inventory
 *
 * @param {Request}  req   Express.js object that contains all data pertaining to the DELETE request.
 * @param {Response} res   Express.js object that contains all data and functions needed to send response to client.
 *
 * @return {null}          Simply sends response back to client to notify of success or failure.
 */
const updateInventoryItem = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Make sure that this item belongs to the store
        const itemId = parseInt(req.params.itemId);
        const validItem = yield isValidItem(itemId);
        if (!validItem) {
            return res.status(404).json("Item not found");
        }
        // Verify that this item is in the inventory of the store making the request
        const storeId = req.store.id;
        const ownedItem = yield isOwnedItem(itemId, storeId);
        if (!ownedItem) {
            return res.status(400).json("Item is invalid.");
        }
        // PATCH request body contains some (or all) of the fields of an InventoryItem to update
        const patchBody = {};
        if ("name" in req.body) {
            patchBody.item_name = req.body.name;
        }
        if ("price" in req.body) {
            patchBody.price = req.body.price;
        }
        if ("quantity" in req.body) {
            patchBody.quantity = req.body.quantity;
        }
        yield inventoryRepository.update(itemId, patchBody);
        res.status(200).json("Item has been updated.");
    }
    catch (err) {
        console.log(err);
        res.status(500).json("Something went wrong.");
    }
});
exports.updateInventoryItem = updateInventoryItem;
