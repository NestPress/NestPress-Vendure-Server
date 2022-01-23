import { VendureEntity, ID, Asset, Customer, DeepPartial, User } from "@vendure/core";
import {
  Column,
  Entity,
  Unique,
  ManyToOne,
  Generated,
  OneToOne,
  OneToMany,
  JoinColumn,
  BeforeInsert,
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToMany,
  JoinTable,
} from "typeorm";
import { PostTaxonomyValue } from "./taxonomy-value.entity";
import { RelatedPost } from "./related-post.entity";

// type InventoryProductInput = Omit<InventoryAmount, "product"> & {
//   product: ID;
// };

export type PostType = "Post" | "Page" | "Comment";
export type PostStatus =
  | "Draft"
  | "Published"
  | "Blocked"
  | "Archive"
  | "Trash";

@Unique(["slug"])
@Entity()
export class Post extends VendureEntity {
  constructor(input?: DeepPartial<Post>) {
    super(input);
  }
  @PrimaryGeneratedColumn()
  id!: number;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @DeleteDateColumn()
  deletedAt!: Date;

  @Column({
    nullable: true,
  })
  publishAt?: Date;

  @Column({
    nullable: true,
  })
  expireAt?: Date;

  @OneToOne(() => Customer)
  createdBy!: Customer;

  @Column({
    default: "Post",
  })
  postType!: PostType;

  // @Column()
  // assets?: Assets

  @Column({
    default: "Draft",
  })
  status!: PostStatus;

  @Column()
  title!: string;

  @Column({
    nullable: true,
  })
  slug!: string;

  @Column({
    nullable: true,
  })
  content?: string;

  @Column({
    type: "varchar",
    default: ""
  })
  customType?: string;

  @Column({
    type: "simple-json",
    nullable: true,
  })
  customFields?: any | null;

  @OneToMany(() => RelatedPost, (relatedPost) => relatedPost.leftPost)
  @JoinColumn()
  leftRelatedPosts!: RelatedPost[];

  @OneToMany(() => RelatedPost, (relatedPost) => relatedPost.leftPost)
  @JoinColumn()
  rightRelatedPosts!: RelatedPost[];

  @ManyToMany(
    () => PostTaxonomyValue,
    (postTaxonomy) => postTaxonomy.taxonomiesPosts
  )
  @JoinTable()
  postTaxonomies!: PostTaxonomyValue[];

  @ManyToOne(
    () => User
  )
  @JoinColumn()
  author!: User;
}
