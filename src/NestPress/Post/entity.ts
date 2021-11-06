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
} from "typeorm";
import { DeepPartial } from "@vendure/common/lib/shared-types";

// type InventoryProductInput = Omit<InventoryAmount, "product"> & {
//   product: ID;
// };


export type PostType = "Post" | "Page" | "Comment";
export type PostStatus = "Draft" | "Published" | "Blocked" | "Archive" | "Trash";


@Unique(["slug"])
@Entity()
export class Post extends VendureEntity {
  constructor(input?: DeepPartial<Post>) {
    super(input);
  }
    @PrimaryGeneratedColumn()
    id!: number
    @CreateDateColumn()
    createdAt!: Date
    
    @UpdateDateColumn()
    updatedAt!: Date

    @DeleteDateColumn()
    deletedAt!: Date

    @Column({
      nullable: true
    })
    publishAt?: Date 
    @Column({
      nullable: true
    })
    expireAt?: Date
    @OneToOne(() => Customer)
    createdBy!: Customer
    @Column({
      default: 'Post'
    })
    postType!: PostType
    
    // @Column()
    // assets?: Assets

    @Column({
      default: 'Draft'
    })
    status!: PostStatus
    @Column()
    title!: string
    @Column({
      nullable: true
    })
    slug!: string
    @Column({
      nullable: true
    })
    content?: string
    @OneToMany(() => PostTaxonomy, taxonomy => taxonomy.posts)
    @JoinColumn()
    taxonomy!: PostTaxonomy[]
    @OneToMany(() => RelatedPost, relatedPost=>relatedPost.post)
    @JoinColumn()
    relatedPosts!: RelatedPost[]
    @OneToMany(() => RelatedUser, relatedUser=>relatedUser.post)
    @JoinColumn()
    relatedUsers!: RelatedUser[]

}

@Entity()
export class PostTaxonomy extends VendureEntity {
  constructor(input?: DeepPartial<Post>) {
    super(input);
  }
  @ManyToOne(() => Post, post => post.taxonomy)
  @JoinColumn()
  posts!: Post[];
  
  @OneToMany(() => PostTaxonomyValue, postTaxonomy => postTaxonomy.postCategories)
  @JoinColumn()
  postCategories!: PostTaxonomyValue[]
  
  @OneToMany(() => PostTaxonomyValue, postTaxonomy => postTaxonomy.postTags)
  @JoinColumn()
  postTags!: PostTaxonomyValue[]
}

@Entity()
export class PostTaxonomyValue extends VendureEntity {
  constructor(input?: DeepPartial<Post>) {
    super(input);
  }
  @PrimaryGeneratedColumn()
  id!: number
  
  @Column()
  key!: string
  
  @Column()
  value!: string

  @JoinColumn()
  @ManyToOne(() => PostTaxonomyValue, {})
  parent?: PostTaxonomyValue

  @ManyToOne(() => PostTaxonomy)
  postCategories!: PostTaxonomy;

  @ManyToOne(() => PostTaxonomy)
  postTags!: PostTaxonomy;
}

export class RelatedEntity extends VendureEntity {
  constructor(input?: DeepPartial<Post>) {
    super(input);
  }
  @PrimaryGeneratedColumn()
  id!: number
  @Column()
  relationType!: string
  @Column({
    type: 'simple-json'
  })
  customFields?: any
  @JoinColumn()
  @ManyToOne(() => Post, post => post.relatedPosts)
  post!: Post
}

@Entity()
export class RelatedPost extends RelatedEntity {
  constructor(input?: DeepPartial<Post>) {
    super(input);
  }
}
@Entity()
export class RelatedUser extends RelatedEntity {
  constructor(input?: DeepPartial<Post>) {
    super(input);
  }
}

