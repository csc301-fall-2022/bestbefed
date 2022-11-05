"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDataSource = void 0;
require("reflect-metadata");
const typeorm_1 = require("typeorm");
const Inventory_1 = require("./entity/Inventory");
const Order_1 = require("./entity/Order");
const User_1 = require("./entity/User");
const CartItem_1 = require("./entity/CartItem");
const OrderedItem_1 = require("./entity/OrderedItem");
const Store_1 = require("./entity/Store");
exports.AppDataSource = new typeorm_1.DataSource({
    type: "postgres",
    // host: "bestbefed-data.czbbb7d5g36e.us-east-2.rds.amazonaws.com",
    host: "localhost",
    port: 5432,
    username: "postgres",
    // password: "12345678",
    password: "postgres",
    database: "postgres",
    entities: [User_1.User, Order_1.Order, Inventory_1.Inventory, CartItem_1.CartItem, OrderedItem_1.OrderedItem, Store_1.Store],
    synchronize: true,
    logging: false,
});
