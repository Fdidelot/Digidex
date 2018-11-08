import { Entity, BaseEntity, PrimaryGeneratedColumn, Column, ManyToOne, useContainer } from "typeorm";
import { User } from "./User";

@Entity()
export class Digimon extends BaseEntity {

    @PrimaryGeneratedColumn()
    public id: number;

    @Column()
    public name: string;

    @Column()
    public type: string;

    @ManyToOne(type => User, user => user.digimons)
    owner: User;
}