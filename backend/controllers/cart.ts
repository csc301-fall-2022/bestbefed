import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { CartItemInfo, CleanCartInfo } from "./interfaces";
import { CartItem } from "../entity/CartItem";
import { User } from "../entity/User";
import { Inventory } from "../entity/Inventory";
import { Equal } from "typeorm";

// Create multiple repositories that allows us to use TypeORM to interact w/ entities in DB.
const cartRepository = AppDataSource.getRepository(CartItem);
const userRepository = AppDataSource.getRepository(User);
const inventoryRepository = AppDataSource.getRepository(Inventory);

/**
 * Handles POST store/ and attempts to create new Store in database.
 *
 * @param {Request}  req   Express.js object that contains all data pertaining to the POST request.
 * @param {Response} res   Express.js object that contains all data and functions needed to send response to client.
 *
 * @return {null}          Simply sends response back to client to notify of success or failure.
 */
export const addCartItem = async (req: Request, res: Response) => {
  try {
    // Attempt to get user ID from cookies
    //let userId: string = (<any>req).user.id;
    let userId = (<any>req).body.user;
    if (!userId) {
      // user ID not specified in URL query params
      // Grab the user's uuid from the payload of the token held by the cookie
      userId = (<any>req.body).user;
    }
    const user: User | null = await userRepository.findOneBy({
      user_id: userId,
    });

    if (!user) {
      return res.status(404).json("User not found");
    }

    // Clean the fields of the item's data, we only need quantity rn but may need more later
    const cartItem: CleanCartInfo = cleanFields(req.body);
    const inventoryItem: Inventory | null = await inventoryRepository.findOneBy(
      {
        item_id: Equal(cartItem.inventoryItemId),
      }
    );
    if (!inventoryItem) {
      return res.status(404).json("The item was not found in inventory");
    }

    const newCartItem: CartItem = new CartItem();
    newCartItem.customer = user;
    newCartItem.quantity = cartItem.quantity;
    newCartItem.added_date = new Date();
    newCartItem.cart_item = inventoryItem;
    await cartRepository.save(newCartItem);
    // re-calculate the total for the cart
    // var total: number = (<any>req).total;
    // total +=
    //   newCartItem.cart_item.price.valueOf() *
    //   newCartItem.cart_item.quantity.valueOf();

    // Send back 201 upon successful creation
    res.status(201).json(4);
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
export const removeCartItem = async (req: Request, res: Response) => {
  try {
    const clearAll = (<any>req.params).clearAll === "true";
    // Attempt to get user ID from cookies
    //let userId: string = (<any>req).user.id;
    let userId = (<any>req).body.user;
    if (!userId) {
      // user ID not specified in URL query params
      // Grab the user's uuid from the payload of the token held by the cookie
      userId = (<any>req.body).user;
    }
    // If the request is to clear all of the items, then do so
    if (clearAll) {
      await cartRepository.delete({ customer: { user_id: userId } });
      return res.status(404).json(0);
    }

    // Get the item that the store manager is trying to delete.
    const cartItemId: number = parseInt(req.params.cartItemId);

    // check that the item belongs to the user
    if (!isValidItem(cartItemId, userId)) {
      return res
        .status(404)
        .json(
          "Cart item does not exist or does not belong to the correct user"
        );
    }

    // calculating the total
    // var total: number = (<any>req).total;
    // var price: number = (<any>req).price;
    // total = total - price;

    await cartRepository.delete(cartItemId);
    res.status(200).json(4);
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
export const updateCartQuantity = async (req: Request, res: Response) => {
  try {
    // Attempt to get user ID from cookies
    //let userId: string = (<any>req).user.id;
    let userId = (<any>req).body.user;
    if (!userId) {
      // user ID not specified in URL query params
      // Grab the user's uuid from the payload of the token held by the cookie
      userId = (<any>req.body).user;
    }
    const cartItemId: number = parseInt(req.params.cartItemId);
    // Make sure that this item belongs to the store
    if (!isValidItem(cartItemId, userId)) {
      return res
        .status(404)
        .json(
          "Cart item does not exist or does not belong to the correct user"
        );
    }
    // PATCH request body contains the quantity that we want to update
    const patchBody = {};
    if ("quantity" in req.body) {
      (<any>patchBody).quantity = req.body.quantity;
    }
    await cartRepository.update(cartItemId, patchBody);
    // update the total cost
    // var total: number = (<any>req).total;
    // var price: number = (<any>req).price;
    // var difference = (<any>req).oldQuantity - (<any>req).newQuantity;
    // total += difference * price;
    res.status(200).json(4);
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
export const listCartItem = async (req: Request, res: Response) => {
  try {
    // Attempt to get user ID from cookies
    //let userId: string = (<any>req).user.id;
    let userId: string = (<any>req).body.user;
    if (!userId) {
      // user ID not specified in URL query params
      // Grab the user's uuid from the payload of the token held by the cookie
      userId = (<any>req).body.user;
    }
    if (!userId) {
      return res.status(400).json("User not specified");
    }
    var total: number = 0;
    // Query for all the items in the cart for this user.

    const user = await userRepository.findOneBy({
      username: "testyt3",
    });

    const cartItems: CartItem[] | null = await cartRepository.find({
      relations: ["customer", "cart_item", "cart_item.store"],
      where: {
        customer: {
          user_id: user?.user_id, // Syntax for querying for an item based on elements of embedded entities/FK relations
        },
      },
    });
    // Convert returned CartItem objects to format expected by frontend.
    const cartInfo: any[] | null = cartItems.map((item) => {
      total += item.quantity.valueOf() * item.cart_item.price.valueOf();
      return <CartItemInfo>{
        cart_id: item.item_id.valueOf(),
        name: item.cart_item.item_name,
        quantity: item.quantity.valueOf(),
        price: item.cart_item.price.valueOf(),
        store: item.cart_item.store.store_name,
        inventory_item: item.cart_item.item_id.valueOf(),
      };
    });
    cartInfo.push(total);
    res.status(200).json(cartInfo);
  } catch (err) {
    res.status(500).send(err);
  }
};

/**
 * HELPER: checks that the item exists and belongs to the user that is passed in
 *
 * @param {number} cartItemId       the id of the item that is being checked
 *
 * @param {string} userId           the id of the user that the item is supposed to belong to
 *
 * @return {boolean}              whether the item exists and belongs to the correct user or not.
 */
const isValidItem = async (cartItemId: number, userId: string) => {
  const cartItem = await cartRepository.find({
    relations: ["customer"],
    where: {
      item_id: Equal(Number(cartItemId)), // Syntax for querying for an item based on elements of embedded entities/FK relations
    },
  });
  if (!cartItem) {
    return false;
  }
  if (cartItem[0]?.customer.user_id != userId) {
    return false;
  }
  return true;
};

/**
 * HELPER: sanitizes all the fields in an object of type ItemInfo to prepare it for creation in Database.
 *
 * @param {ItemInfo} itemData       Object containing unsanitized data needed for the creation of an InventoryItem entity.
 *
 * @return {ItemInfo}               A sanitized ItemInfo object.
 */
const cleanFields = (cartItemData: CleanCartInfo) => {
  if ("quantity" in cartItemData) {
    cartItemData["quantity"] = Math.round(cartItemData["quantity"]);
  }
  if ("inventoryItemId" in cartItemData) {
    cartItemData["inventoryItemId"] = cartItemData["inventoryItemId"];
  }
  return <CleanCartInfo>cartItemData;
};
