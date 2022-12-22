import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  ManyToOne,
} from "typeorm";
import { User } from "./User";

@Entity()
export class Order extends BaseEntity {
  // Using uuid instead - 16 bit randomly generated id that is hidden and can't be easily guessed
  @PrimaryGeneratedColumn()
  order_id!: number;

  @Column("date")
  order_date!: Date;

  @ManyToOne(() => User, (user) => user.user_id)
  customer!: User;
}
