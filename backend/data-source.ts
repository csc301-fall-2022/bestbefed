import "reflect-metadata"
import { DataSource } from "typeorm"
import { Item } from "./entity/Item";
import { Order } from "./entity/Order";
import { User } from "./entity/User"

export const AppDataSource = new DataSource({
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "postgres",
    password: "postgres",
    database: "postgres",
    entities: [User, Order, Item],
    synchronize: true,
    logging: false,
});