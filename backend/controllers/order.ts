// Library imports/data

import { removeCartItem } from "./cart";

import express, { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Equal } from "typeorm";
// import validator from "validator";

// Interface Imports
import { OrderRequest } from "./interfaces";
import { CartItemInfo, CleanCartInfo } from "./interfaces";

// Entity Imports
import { CartItem } from "../entity/CartItem";
import { Order } from "../entity/Order";
import { OrderedItem } from "../entity/OrderedItem";
import { User } from "../entity/User";
import { Store } from "../entity/Store";
import { InventoryItem } from "../entity/InventoryItem";
import { collapseTextChangeRangesAcrossMultipleVersions } from "typescript";

// Relevant repository setup
const storeInventoryRepository = AppDataSource.getRepository(InventoryItem);
const cartRepository = AppDataSource.getRepository(CartItem);
const userRepository = AppDataSource.getRepository(User);
const orderRepository = AppDataSource.getRepository(Order);
const orderedItemsRepository = AppDataSource.getRepository(OrderedItem);

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
  try {
    // Attempt to get user ID from cookies
    // const userId: string = (<any>req).user.id
    const userId: string = (<any>req).user.id;
    if (!userId) {
      return res.status(400).json("User not specified");
    }
    const user: User | null = await userRepository.findOneBy({
      user_id: userId,
    });
    if (!user) {
      return res.status(404).json("User not found");
    }

    // find the items by the user
    var cartItems: CartItem[] | null = await cartRepository.find({
      relations: ["customer", "cart_item", "cart_item.store"],
      where: {
        customer: {
          user_id: user?.user_id,
        },
      },
    });

    if (cartItems.length == 0) {
      return res.status(400).json("No items in cart to create order.");
    }

    const orderData: OrderRequest = {
      order_date: new Date(),
      customer: user,
    };

    // Construct the newOrder object.
    const newOrder: Order = new Order();
    // Set today's date to the order date.
    newOrder.order_date = orderData["order_date"];
    // Set customer to the logged-in user.
    newOrder.customer = orderData["customer"];
    // Save this newOrder object in the orderRepository
    await orderRepository.save(newOrder);
    // console.log("Adding this many items to Order! " + cartItems.length);

    // Go through each item in the CartItems and check if stores have enough inventory to allow for this order.
    for (let i = 0; i < cartItems.length; i++) {
      // Check if cartItems.cart_item.quantity ("requested item in cart's store inventory quantity")
      // is greater than cartItems.quantity ("requested item in cart's quantity")
      if (cartItems[i].cart_item.quantity < cartItems[i].quantity) {
        return res
          .status(400)
          .json(
            "The store(s) do not have the requested inventory to make this order."
          );
      }
    }

    // At this point, we can proceed with the order creation.
    // Go through each item in the CartItems and add it to newOrderedItem and link it to the newOrder.
    for (let i = 0; i < cartItems.length; i++) {
      // Construct the OrderedItem
      const newOrderedItem: OrderedItem = new OrderedItem();
      newOrderedItem.order = newOrder;
      newOrderedItem.inventory_item = cartItems[i].cart_item;
      newOrderedItem.quantity = cartItems[i].quantity;
      await orderedItemsRepository.save(newOrderedItem);

      // Decrement the store's quantity
      // Construct the partial object:
      var tempStoreItem = new InventoryItem();
      tempStoreItem.quantity =
        <number>cartItems[i].cart_item.quantity - <number>cartItems[i].quantity;
      // Update the store inventory repo given the number id and the field to augment.
      await storeInventoryRepository.update(
        <number>cartItems[i].cart_item.item_id,
        tempStoreItem
      );
    }

    await cartRepository.delete({ customer: { user_id: userId } });

    return res
      .status(201)
      .json(
        "New order successfully made for " +
          user.username +
          " at " +
          newOrder.order_date
      );
  } catch (err) {
    return res.status(500).send(err);
  }
};

/**
 * Handles POST requests to `/order/add` and attempts to create a new Order in the database.
 * This method will take the current User's cart items, convert them to
 *
 * @param {Request}  req   Express.js object that contains all data pertaining to the POST request.
 * @param {Response} res   Express.js object that contains all data and functions needed to send response to client.
 *
 * @return {string}        Simply sends response back to client to notify if success or specifies the error
 */
export const cancelOrder = async (req: Request, res: Response) => {
  try {
    // Attempt to get user ID from cookies
    // const userId: string = (<any>req).user.id
    const userId: string = (<any>req).user.id;
    if (!userId) {
      return res.status(400).json("User not specified");
    }
    const user: User | null = await userRepository.findOneBy({
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

    const orderToCancel: Order | null = await orderRepository.findOneBy({
      order_id: Equal(req.body["orderId"]),
      customer: Equal(user.user_id),
    });

    if (!orderToCancel) {
      return res
        .status(404)
        .json("The order requested was not found in our database.");
    }

    // At this point, we have a valid orderToCancel object of type Order

    // Query for the orderedItems[] part of the given requested orderToCancel
    var orderedItems: OrderedItem[] | null = await orderedItemsRepository.find({
      relations: ["order", "inventory_item", "inventory_item.store"],
      where: {
        order: {
          order_id: orderToCancel?.order_id,
        },
      },
    });

    for (let i = 0; i < orderedItems.length; i++) {
      // Increment the store's quantity
      // Construct the partial object:
      var tempStoreItem = new InventoryItem();
      tempStoreItem.quantity =
        <number>orderedItems[i].inventory_item.quantity +
        <number>orderedItems[i].quantity;
      // Update the store inventory repo given the number id and the field to augment.
      await storeInventoryRepository.update(
        <number>orderedItems[i].inventory_item.item_id,
        tempStoreItem
      );

      // Delete the orderedItem
      await orderedItemsRepository.delete(<number>orderedItems[i].item_id);
    }

    // Now after wiping all ordered items, we can safely delete the entire Order object from the database:
    await orderRepository.delete(req.body["orderId"]);

    return res
      .status(201)
      .json("Order with id: " + req.body["orderId"] + " successfully deleted.");
  } catch (err) {
    return res.status(500).send(err);
  }
};
