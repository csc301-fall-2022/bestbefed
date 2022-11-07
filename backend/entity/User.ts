import {
  Entity,
  PrimaryColumn,
  Column,
  BeforeInsert,
  BaseEntity,
} from "typeorm";
import { v4 as uuidv4 } from "uuid";

import { PaymentInfo } from "../controllers/interfaces";

@Entity()
export class User extends BaseEntity {
  // Using uuid instead - 16 bit randomly generated id that is hidden and can't be easily guessed
  @PrimaryColumn("uuid")
  user_id!: string;

  @Column("varchar", { length: 255 })
  username!: string;

  @Column("varchar", { length: 255 })
  firstName!: string;

  @Column("varchar", { length: 255 })
  lastName!: string;

  @Column("varchar", { length: 255 })
  email!: string;

  @Column("text")
  password!: string;

  @Column("boolean")
  email_verified!: boolean;

  @Column("date")
  create_date!: Date; // string<Date>

  @Column("simple-json")
  payment_info!: PaymentInfo;

  @BeforeInsert()
  generateId() {
    this.user_id = uuidv4();
  }
}
