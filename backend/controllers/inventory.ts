import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { ItemInfo, StoreInfo } from "./interfaces";
import { Store } from "../entity/Store";
import { InventoryItem } from "../entity/InventoryItem";

const storeRepository = AppDataSource.getRepository(Store);
const inventoryRepository = AppDataSource.getRepository(InventoryItem);

/**
 * HELPER: sanitizes all the fields in an object of type ItemInfo to prepare it for creation in Database.
 *
 * @param {ItemInfo} itemData       Object containing unsanitized data needed for the creation of an InventoryItem entity.
 *
 * @return {ItemInfo}               A sanitized ItemInfo object.
 */
const cleanFields = (itemData: ItemInfo) => {
    if ("name" in itemData) {
        itemData["name"] = itemData["name"].trim();
    }
    if ("price" in itemData) {
        itemData["price"] = parseInt(itemData["price"].toFixed(2));
    }
    if ("quantity" in itemData) {
        itemData["quantity"] = Math.round(itemData["quantity"]);
    }
    return <ItemInfo>itemData;
}

/**
 * HELPER: sanitizes all the fields in an object of type ItemInfo to prepare it for creation in Database.
 *
 * @param {ItemInfo} itemData       Object containing unsanitized data needed for the creation of an InventoryItem entity.
 *
 * @return {ItemInfo}               A sanitized ItemInfo object.
 */
const isValidItem = async (itemId: number) => {
    const item = await inventoryRepository.findOneBy({ item_id: <any>itemId });
    if (!item) {
        return false;
    }

    return true;
}

/**
 * HELPER: sanitizes all the fields in an object of type ItemInfo to prepare it for creation in Database.
 *
 * @param {ItemInfo} itemData       Object containing unsanitized data needed for the creation of an InventoryItem entity.
 *
 * @return {ItemInfo}               A sanitized ItemInfo object.
 */
const isOwnedItem = async (itemId: number, storeId: string) => {
    const item = await inventoryRepository.findOneBy({ item_id: <any>itemId });
    if (item?.store.store_id !== storeId) {
        return false;
    }

    return true;
}

/**
 * Handles GET request to /stores/items to find and return all items in a store's inventory
 *
 * @param {Request}  req   Express.js object that contains all data pertaining to the POST request.
 * @param {Response} res   Express.js object that contains all data and functions needed to send response to client.
 *
 * @return {null}          Simply sends response back to client to notify of success or failure.
 */
export const listInventory = async (req: Request, res: Response) => {
    try {
        // Grab the store's uuid from the payload of the token held by the cookie
        const storeId: string = (<any>req).store;

        // Query for all the items for this store. 
        const items: InventoryItem[] | null = await inventoryRepository.find({
            relations: {
                store: true,
            },
            where: {
                store: {
                    store_id: storeId   // Syntax for querying for an item based on elements of embedded entities/FK relations
                },
            },
        });

        // Convert returned InventoryItem objects to format expected by frontend.
        const itemInfo: ItemInfo[] | null = items.map((item) => {
            return <ItemInfo>{
                itemId: item.item_id,
                name: item.item_name,
                price: item.price,
                quantity: item.quantity,
            }
        });
        res.status(200).json(itemInfo);
    } catch (err) {
        // Shouldn't keep this as a 500 - need a more specific error
        res.status(500).send(err);
    }
};

/**
 * Handles POST request to /stores/items/add to add a new item to the inventory of a specific store
 *
 * @param {Request}  req   Express.js object that contains all data pertaining to the POST request.
 * @param {Response} res   Express.js object that contains all data and functions needed to send response to client.
 *
 * @return {null}          Simply sends response back to client to notify of success or failure.
 */
export const addInventoryItem = async (req: Request, res: Response) => {
    try {
        // Get the store whose inventory we are manipulating
        const storeId: string = (<any>req).store;
        const store: Store | null = await storeRepository.findOneBy({ store_id: storeId });
        if (!store) {
            return res.status(404).json("Store not found");
        }

        // Clean the fields of the item's data
        const item: ItemInfo = cleanFields(req.body);

        // Create and store the item object
        const inventoryItem = new InventoryItem();
        inventoryItem.store = <Store>store;
        inventoryItem.item_name = item.name;
        inventoryItem.price = item.price;
        inventoryItem.quantity = item.quantity;

        await inventoryRepository.save(inventoryItem);
        res.status(201).json("New item added.");
    } catch (err) {
        res.status(400).json("Item data was invalid.");
    }
};

/**
 * Handles DELETE request to /stores/items/:itemId to remove a specific item from the store's inventory
 *
 * @param {Request}  req   Express.js object that contains all data pertaining to the DELETE request.
 * @param {Response} res   Express.js object that contains all data and functions needed to send response to client.
 *
 * @return {null}          Simply sends response back to client to notify of success or failure.
 */
export const removeInventoryItem = async (req: Request, res: Response) => {
    try {
        // Get the item that the store manager is trying to delete.
        const itemId: number = parseInt(req.params.itemId);
        const item = await inventoryRepository.findOneBy({ item_id: <any>itemId });
        if (!item) {
            return res.status(404).json("Item not found");
        }

        // Verify that this item is in the inventory of the store making the request
        const storeId: string = (<any>req).store;
        const store: Store | null = await storeRepository.findOneBy({ store_id: storeId });
        if (item?.store.store_id !== store?.store_id) {
            return res.status(400).json("Item is invalid.");
        }

        // Remove the item from inventory
        await inventoryRepository.delete(itemId);
        res.status(200).json("Item deleted successfully.");
    } catch (err) {
        res.status(500).json("Something went wrong");
    }
};

/**
 * Handles PATCH request to /stores/items/:itemId to update a specific item in the store's inventory
 *
 * @param {Request}  req   Express.js object that contains all data pertaining to the DELETE request.
 * @param {Response} res   Express.js object that contains all data and functions needed to send response to client.
 *
 * @return {null}          Simply sends response back to client to notify of success or failure.
 */
export const updateInventoryItem = async (req: Request, res: Response) => {
    try {
        // Make sure that this item belongs to the store
        const itemId: number = parseInt(req.params.itemId);
        if (!isValidItem(itemId)) {
            return res.status(404).json("Item not found");
        }

        // Verify that this item is in the inventory of the store making the request
        const storeId: string = (<any>req).store;
        if (!isOwnedItem(itemId, storeId)) {
            return res.status(400).json("Item is invalid.");
        }
        
        // PATCH request body contains some (or all) of the fields of an InventoryItem to update
        const patchBody = {};
        if ("name" in req.body) {
            (<any>patchBody).item_name = req.body.itemName;
        }
        if ("price" in req.body) {
            (<any>patchBody).price = req.body.price;
        }
        if ("quantity" in req.body) {
            (<any>patchBody).quantity = req.body.quantity;
        }

        await inventoryRepository.update(itemId, patchBody);
        res.status(200).json("Item has been updated.");
    } catch (err) {
        res.status(500).json("Something went wrong.");
    }
};
