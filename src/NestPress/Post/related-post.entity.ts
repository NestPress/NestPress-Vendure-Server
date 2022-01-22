import { VendureEntity } from "@vendure/core";
import {
  DeepPartial,
  PrimaryGeneratedColumn,
  Column,
  Entity,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { Post } from "./post.entity";

export class RelatedEntity extends VendureEntity {
  constructor(input?: DeepPartial<Post>) {
    super(input);
  }
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  relationType!: string;

  @Column({
    type: "simple-json",
  })
  customFields?: any;
}

@Entity('related_posts')
export class RelatedPost extends RelatedEntity {
  constructor(input?: DeepPartial<Post>) {
    super(input);
  }

  @ManyToOne(() => Post, (post) => post.leftRelatedPosts)
  @JoinColumn()
  leftPost!: Post;

  @ManyToOne(() => Post, (post) => post.rightRelatedPosts)
  @JoinColumn()
  rightPost!: Post;
}
