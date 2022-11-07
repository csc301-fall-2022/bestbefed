import { Entity, PrimaryGeneratedColumn, BaseEntity, ManyToOne } from "typeorm";
import { Inventory } from "./Inventory";
import { Order } from "./Order";

@Entity()
export class OrderedItem extends BaseEntity {
  // Using uuid instead - 16 bit randomly generated id that is hidden and can't be easily guessed
  @PrimaryGeneratedColumn()
  item_id!: Number;

  @ManyToOne(() => Inventory, (inventory) => inventory.item_id)
  inventory_item!: Inventory;

  @ManyToOne(() => Order, (order) => order.order_id)
  order!: Order;
}
