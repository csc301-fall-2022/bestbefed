import { Entity, PrimaryGeneratedColumn, Column, BeforeInsert, BaseEntity, ManyToOne } from "typeorm";
import { User } from "./User";

@Entity()
export class Item extends BaseEntity {
    // Using uuid instead - 16 bit randomly generated id that is hidden and can't be easily guessed
    @PrimaryGeneratedColumn()
    id!: Number;

    @ManyToOne(() => User, (user) => user.cart)
    user!: User;
}