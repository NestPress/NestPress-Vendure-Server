import { VendureEntity } from "@vendure/core";
import { Entity, DeepPartial, PrimaryGeneratedColumn, Column, JoinColumn, ManyToOne, ManyToMany } from "typeorm";
import { Post } from "./post.entity";

export type PostTaxonomyType = 'Tag' | 'Category';

@Entity()
export class PostTaxonomyValue extends VendureEntity {
  constructor(input?: DeepPartial<Post>) {
    super(input);
  }
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  key!: string;

  @Column('varchar')
  type!: PostTaxonomyType;

  @Column()
  value!: string;

  @JoinColumn()
  @ManyToOne(() => PostTaxonomyValue, {})
  parent?: PostTaxonomyValue;

  @ManyToMany(() => Post, post => post.postTaxonomies)
  taxonomiesPosts!: PostTaxonomyValue;
}
