import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  ManyToOne,
} from "typeorm";
import { InventoryItem } from "./InventoryItem";
import { User } from "./User";

@Entity()
export class CartItem extends BaseEntity {
  // Using uuid instead - 16 bit randomly generated id that is hidden and can't be easily guessed
  @PrimaryGeneratedColumn()
  item_id!: Number;

  @Column("int")
  quantity!: Number;

  @Column("date")
  added_date!: Date;

  @ManyToOne(() => InventoryItem, (inventoryItem) => inventoryItem.item_id)
  cart_item!: InventoryItem;

  @ManyToOne(() => User, (user) => user.user_id)
  customer!: User;
}
