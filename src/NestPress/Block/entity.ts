import { DeepPartial, VendureEntity } from "@vendure/core";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryColumn, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Block extends VendureEntity {
  constructor(input?: DeepPartial<Block>) {
    super(input);
  }

  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @DeleteDateColumn()
  deletedAt!: Date;

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

  @Column({
    type: 'int',
    default: 0
  })
  order!: number;
}
