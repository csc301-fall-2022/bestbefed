import {
  Entity,
  PrimaryColumn,
  Column,
  BeforeInsert,
  BaseEntity,
  Index,
} from "typeorm";
import { v4 as uuidv4 } from "uuid";
import { Geometry, Point } from "geojson";

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

  @Index({ spatial: true })
  @Column({
    type: "geography",
    spatialFeatureType: "Point",
    srid: 4326,
  })
  location!: Point;

  @Column("text")
  address!: string;

  @Column("text", { default: "" })
  type!: string;

  @BeforeInsert()
  generateId() {
    this.store_id = uuidv4();
  }
}
