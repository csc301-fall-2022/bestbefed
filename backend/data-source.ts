import "reflect-metadata";
import { DataSource } from "typeorm";
import { Inventory } from "./entity/Inventory";
import { Order } from "./entity/Order";
import { User } from "./entity/User";
import { CartItem } from "./entity/CartItem";
import { OrderedItem } from "./entity/OrderedItem";
import { Store } from "./entity/Store";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: "postgres",
  password: "postgres",
  database: "postgres",
  entities: [User, Order, Inventory, CartItem, OrderedItem, Store],
  synchronize: true,
  logging: false,
});
