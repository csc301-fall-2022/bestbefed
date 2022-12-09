import "reflect-metadata";
import { DataSource } from "typeorm";
import { InventoryItem } from "./entity/InventoryItem";
import { Order } from "./entity/Order";
import { User } from "./entity/User";
import { CartItem } from "./entity/CartItem";
import { OrderedItem } from "./entity/OrderedItem";
import { Store } from "./entity/Store";

export const AppDataSource = new DataSource({
  type: "postgres",
  host:
    process.env.PRODUCTION == "true"
      ? "bestbefed-data.czbbb7d5g36e.us-east-2.rds.amazonaws.com"
      : "localhost",
  port: 5432,
  username: "postgres",
  password: process.env.PRODUCTION ? process.env.POSTGRES_PW : "postgres",
  database: "postgres",
  entities: [User, Order, InventoryItem, CartItem, OrderedItem, Store],
  synchronize: true,
  logging: false,
});
