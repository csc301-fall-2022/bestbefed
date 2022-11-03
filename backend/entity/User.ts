import { Entity, PrimaryColumn, Column, BeforeInsert, BaseEntity, OneToMany } from "typeorm";
import { v4 as uuidv4 } from 'uuid';

import { Item } from "./Item";
import { Order } from "./Order";
import { PaymentInfo } from "../controllers/interfaces";

@Entity()
export class User extends BaseEntity {
    // Using uuid instead - 16 bit randomly generated id that is hidden and can't be easily guessed
    @PrimaryColumn("uuid")
    id!: string;
    
    @Column("varchar", {length: 255})
    username!: string;

    @Column("varchar", {length: 255})
    firstName!: string;

    @Column("varchar", {length: 255})
    lastName!: string;

    @Column("varchar", {length: 255})
    email!: string;

    @Column("text")
    password!: string;

    @Column("boolean")
    emailVerified!: boolean;

    @Column("date")
    createDate!: Date;      // string<Date>

    @OneToMany(() => Order, (order) => order.user)
    orders!: Order[];

    @OneToMany(() => Item, (item) => item.user)
    cart!: Item[];

    @Column("simple-json")
    paymentInfo!: PaymentInfo;

    @BeforeInsert()
    generateId() {
        this.id = uuidv4();
    }
}