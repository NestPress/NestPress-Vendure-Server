import { VendureEntity, ID, Asset } from "@vendure/core";
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
} from "typeorm";
import { DeepPartial } from "@vendure/common/lib/shared-types";

// type InventoryProductInput = Omit<InventoryAmount, "product"> & {
//   product: ID;
// };


type PostType = "Post" | "Page" | "Comment";
type PostStatus = "Draft" | "Published" | "Blocked" | "Archive" | "Trash";


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
    @Column()
    publishAt?: Date 
    @Column()
    expireAt?: Date
    @OneToOne(() => Customer)
    createdBy!: Customer
    @Column({
      default: 'Post'
    })
    postType!: PostType
    @Column()
    assets?: Assets
    @Column({
      default: 'Draft'
    })
    status!: PostStatus
    @Column()
    title!: string
    @Column()
    slug!: string
    @Column()
    content?: string
    @OneToMany(() => PostTaxonomy, taxonomy => taxonomy.posts)
    @JoinColumn()
    taxonomy!: PostTaxonomy[]
    @OneToMany(() => RelatedPost, relatedPosts=>relatedPost.post)
    @JoinColumn()
    relatedPosts!: RelatedPost[]
    @OneToMany(() => RelatedUser, relatedUser=>relatedPost.post)
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
  
  @OneToMany(() => PostTaxonomyValue)
  @JoinColumn()
  postCategories!: [PostTaxonomyValue]
  
  @OneToMany(() => PostTaxonomyValue)
  @JoinColumn()
  postTags!: [PostTaxonomyValue]
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
  @ManyToOne(() => PostTaxonomyValue)
  parent?: PostTaxonomyValue
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
export class RelatedEntity extends VendureEntity {
  constructor(input?: DeepPartial<Post>) {
    super(input);
  }
  @PrimaryGeneratedColumn()
  id!: number
  @Column()
  relationType!: string
  @Column()
  customFields?: any
  @JoinColumn()
  @ManyToOne(() => Post, post => post.relatedPosts)
  post!: Post
}
