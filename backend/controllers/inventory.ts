import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { StoreInfo, ItemInfo } from "./interfaces";
import { Store } from "../entity/Store";
import { InventoryItem } from "../entity/InventoryItem";

import jwt from "jsonwebtoken";

const storeRepository = AppDataSource.getRepository(Store);
const inventoryRepository = AppDataSource.getRepository(InventoryItem);

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
export const addInventoryItem = (req: Request, res: Response) => {

};

export const removeInventoryItem = (req: Request, res: Response) => {

};

export const updateInventoryItem = (req: Request, res: Response) => {

};
