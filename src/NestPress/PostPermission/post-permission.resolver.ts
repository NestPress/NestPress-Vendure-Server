import { Resolver, Query, Mutation, Args } from "@nestjs/graphql";

import { Ctx, ID, RequestContext, Transaction } from "@vendure/core";

import { GetListArgs, ListFiltersOperators } from "../common";
import { CreatePostPermissionInput, UpdatePostPermissionInput } from "./post-permission.inputs";
import { PostPermissionService } from "./post-permission.service";

export type PostPermissionsFilter = {
  key: ListFiltersOperators<string>;
  value: ListFiltersOperators<string>;
  parent: ListFiltersOperators<string>;
};

export type GetPostPermissionArgs = GetListArgs<PostPermissionsFilter>;

@Resolver("PostPermission")
export class PostPermissionResolver {
  constructor(private taxonomyValueService: PostPermissionService) {}

  @Mutation()
  @Transaction()
  async createPostPermission(
    @Ctx() ctx: RequestContext,
    @Args() args: { input: CreatePostPermissionInput }
  ) {
    return this.taxonomyValueService.createPostPermission(ctx, args.input);
  }

  @Mutation()
  @Transaction()
  async updatePostPermission(
    @Ctx() ctx: RequestContext,
    @Args() args: { id: ID; input: UpdatePostPermissionInput }
  ) {
    return this.taxonomyValueService.updatePostPermission(
      ctx,
      args.id,
      args.input
    );
  }

  @Mutation()
  @Transaction()
  async deletePostPermission(
    @Ctx() ctx: RequestContext,
    @Args() args: { id: ID }
  ) {
    return this.taxonomyValueService.deletePostPermission(ctx, args.id);
  }

  @Query()
  async getPostPermissions(
    @Ctx() ctx: RequestContext,
    @Args() args: GetPostPermissionArgs
  ) {
    return this.taxonomyValueService.getPostPermissions(ctx, args);
  }

  @Query()
  async getPostPermissionById(
    @Ctx() ctx: RequestContext,
    @Args() args: { id: string }
  ) {
    const post = await this.taxonomyValueService.getById(ctx, args.id);

    return {
      ...post,
    };
  }
}
