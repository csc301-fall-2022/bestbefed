import { Entity, PrimaryGeneratedColumn, BaseEntity, ManyToOne } from "typeorm";
import { InventoryItem } from "./InventoryItem";
import { Order } from "./Order";

@Entity()
export class OrderedItem extends BaseEntity {
  // Using uuid instead - 16 bit randomly generated id that is hidden and can't be easily guessed
  @PrimaryGeneratedColumn()
  item_id!: number;

  @ManyToOne(() => InventoryItem, (inventoryItem) => inventoryItem.item_id)
  inventory_item!: InventoryItem;

  @ManyToOne(() => Order, (order) => order.order_id)
  order!: Order;
}
