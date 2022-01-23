import { Resolver, Query, Mutation, Args } from "@nestjs/graphql";

import { Ctx, ID, RequestContext, Transaction } from "@vendure/core";

import { PostService } from "./post.service";
import { Post, PostType } from "./post.entity";
import { GetListArgs, ListFiltersOperators } from "../common";
import { BlockService } from "../Block/service";
import { PostTaxonomyValue } from "./taxonomy-value.entity";

export type PostInput = {
  publishAt: Date 
  expireAt: Date
  postType: PostType
  title: string
  content: string
  slug: string
  postTaxonomies: []
}

export type PostsFilter = {
  postType?: ListFiltersOperators<Post>;
  id?: ListFiltersOperators<number>;
  category?: ListFiltersOperators<PostTaxonomyValue>
  tags?: ListFiltersOperators<PostTaxonomyValue>
  customType?: ListFiltersOperators<string | null>
}

export type GetPostsArgs = GetListArgs<PostsFilter>;

@Resolver("Post")
export class PostResolver {
  constructor(private postService: PostService, private blockService: BlockService) {}

  @Mutation()
  @Transaction()
  async createPost(
    @Ctx() ctx: RequestContext,
    @Args() args: { input: PostInput }
  ) {
    return this.postService.createPost(ctx, args.input);
  }

  @Mutation()
  @Transaction()
  async updatePost(
    @Ctx() ctx: RequestContext,
    @Args() args: { id: ID, input: PostInput }
  ) {
    return this.postService.updatePost(ctx, args.id, args.input);
  }

  @Mutation()
  @Transaction()
  async deletePost(
    @Ctx() ctx: RequestContext,
    @Args() args: { id: ID }
  ) {
    return this.postService.deletePost(ctx, args.id);
  }

  @Mutation()
  @Transaction()
  async changePostStatus(
    @Ctx() ctx: RequestContext,
    @Args() args: { id: ID, status: string }
  ) {
    return this.postService.changePostStatus(ctx, args.id, args.status);
  }

  @Query()
  async getPosts(@Ctx() ctx: RequestContext, @Args() args: GetPostsArgs) {
    return this.postService.getPosts(ctx, args);
  }

  @Query()
  async getPostById(
    @Ctx() ctx: RequestContext,
    @Args() args: { id: string }
  ) {
    const post = await this.postService.getById(ctx, args.id);

    const blocks = await this.blockService.getBlocks(ctx, {
      filter: {
        post: {
          eq: post?.slug
        }
      },
      sort: {
        order: 'ASC'
      }
    })

    return {
      ...post,
      blocks: blocks.list ? blocks.list : []
    }
  }

  @Query()
  async getPostBySlug(
    @Ctx() ctx: RequestContext,
    @Args() args: { slug: string }
  ) {
    const post = await this.postService.getBySlug(ctx, args.slug);

    const blocks = await this.blockService.getBlocks(ctx, {
      filter: {
        post: {
          eq: post?.slug
        }
      }
    })

    return {
      ...post,
      blocks: blocks.list ? blocks.list : []
    }
  }
}
