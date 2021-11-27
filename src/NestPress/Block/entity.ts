import { DeepPartial, VendureEntity } from "@vendure/core";
import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Block extends VendureEntity {
  constructor(input?: DeepPartial<Block>) {
    super(input);
  }

  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({
      nullable: true,
      default: null
  })
  parentId?: string;

  @Column()
  block!: string;

  @Column({
    nullable: true,
    default: null
  })
  post?: string;

  @Column({
    type: "simple-json",
    default: '{}'
  })
  attrs!: any;
}
