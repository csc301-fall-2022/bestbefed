import {
  Entity,
  PrimaryColumn,
  Column,
  BeforeInsert,
  BaseEntity,
} from "typeorm";
import { v4 as uuidv4 } from "uuid";

@Entity()
export class Store extends BaseEntity {
  // Using uuid instead - 16 bit randomly generated id that is hidden and can't be easily guessed
  @PrimaryColumn("uuid")
  store_id!: string;

  @Column("varchar", { length: 255 })
  store_name!: string;

  @Column("varchar", { length: 255 })
  email!: string;

  @Column("text")
  password!: string;

  @Column("boolean")
  email_verified!: boolean;

  @Column("date")
  create_date!: Date;

  @BeforeInsert()
  generateId() {
    this.store_id = uuidv4();
  }
}
