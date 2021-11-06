import { Resolver, Query, Mutation, Args } from "@nestjs/graphql";

import { Ctx, ID, RequestContext, Transaction } from "@vendure/core";
import { GetPostArgs } from "../schemaTypes";

import { PostService } from "./service";
import { PostInput } from "./entity";

@Resolver("Post")
export class PostResolver {
  constructor(private postService: PostService) {}

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
  async getPosts(@Ctx() ctx: RequestContext, @Args() args: GetPostArgs) {
    return this.postService.getPosts(ctx, args);
  }

  @Query()
  async getPostById(
    @Ctx() ctx: RequestContext,
    @Args() args: { id: string }
  ) {
    return this.postService.getById(ctx, args.id);
  }

}
