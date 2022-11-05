import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  ManyToOne,
} from "typeorm";
import { Store } from "./Store";

@Entity()
export class Inventory extends BaseEntity {
  // Using uuid instead - 16 bit randomly generated id that is hidden and can't be easily guessed
  @PrimaryGeneratedColumn()
  item_id!: Number;

  @ManyToOne(() => Store, (store) => store.store_id)
  store!: Store;

  @Column("varchar", { length: 255 })
  item_name!: string;

  @Column("float")
  price!: Number;

  @Column("int")
  quantity!: Number;
}
