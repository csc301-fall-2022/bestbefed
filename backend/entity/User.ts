import { Entity, PrimaryColumn, Column, BeforeInsert, BaseEntity } from "typeorm";

import { v4 as uuidv4 } from 'uuid';

@Entity()
export class User extends BaseEntity {
    // Using uuid instead - 16 bit randomly generated id that is hidden and can't be easily guessed
    @PrimaryColumn("uuid")
    id!: string;

    @Column("varchar", {length: 255})
    firstName!: string;

    @Column("varchar", {length: 255})
    lastName!: string;

    @Column("varchar", {length: 255})
    email!: string;

    @Column("text")
    password!: string;

    @Column("date")
    dateOfBirth!: Date;     // string<Date>

    @Column("boolean")
    emailVerified!: boolean;

    @Column("date")
    createDate!: Date;      // string<Date>

    @BeforeInsert()
    generateId() {
        this.id = uuidv4();
    }
}