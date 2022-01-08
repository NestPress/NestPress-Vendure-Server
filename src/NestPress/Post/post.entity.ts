import { VendureEntity, ID, Asset, Customer } from "@vendure/core";
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
import { DeepPartial } from "@vendure/common/lib/shared-types";
import { PostTaxonomyValue } from "./taxonomy-value.entity";

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
    nullable: true,
  })
  customType?: string | null;

  @Column({
    type: "simple-json",
    nullable: true,
  })
  customFields?: any | null;

  @OneToMany(() => RelatedPost, (relatedPost) => relatedPost.post, {
    cascade: true,
  })
  @JoinColumn()
  relatedPosts!: RelatedPost[];

  @OneToMany(() => RelatedUser, (relatedUser) => relatedUser.post, {
    cascade: true,
  })
  @JoinColumn()
  relatedUsers!: RelatedUser[];

  @ManyToMany(
    () => PostTaxonomyValue,
    (postTaxonomy) => postTaxonomy.taxonomiesPosts
  )
  @JoinTable()
  postTaxonomies!: PostTaxonomyValue[];
}

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

@Entity()
export class RelatedPost extends RelatedEntity {
  constructor(input?: DeepPartial<Post>) {
    super(input);
  }

  @ManyToOne(() => Post, (post) => post.relatedPosts)
  @JoinColumn()
  post!: Post;
}
@Entity()
export class RelatedUser extends RelatedEntity {
  constructor(input?: DeepPartial<Post>) {
    super(input);
  }

  @JoinColumn()
  @ManyToOne(() => Post, (post) => post.relatedPosts)
  post!: Post;
}
