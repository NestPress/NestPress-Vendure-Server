import { Resolver, Query, Mutation, Args } from "@nestjs/graphql";

import { Ctx, ID, RequestContext, Transaction } from "@vendure/core";

import { GetListArgs, ListFiltersOperators } from "../common";
import { CreateRelatedPostInput, UpdateRelatedPostInput } from "./related-post.inputs";
import { RelatedPostService } from "./related-post.service";
import { PostTaxonomyType } from "./taxonomy-value.entity";

export type RelatedPostFilter = {
  key: ListFiltersOperators<string>;
  value: ListFiltersOperators<string>;
  type: ListFiltersOperators<PostTaxonomyType>;
  parent: ListFiltersOperators<string>;
};

export type GetTaxonomyValuesArgs = GetListArgs<RelatedPostFilter>;

@Resolver("RelatedPosts")
export class RelatedPostResolver {
  constructor(private taxonomyValueService: RelatedPostService) {}

  @Mutation()
  @Transaction()
  async createRelatedPost(
    @Ctx() ctx: RequestContext,
    @Args() args: { input: CreateRelatedPostInput }
  ) {
    return this.taxonomyValueService.createRelatedPost(ctx, args.input);
  }

  @Mutation()
  @Transaction()
  async updateRelatedPost(
    @Ctx() ctx: RequestContext,
    @Args() args: { id: ID; input: UpdateRelatedPostInput }
  ) {
    return this.taxonomyValueService.updateRelatedPost(
      ctx,
      args.id,
      args.input
    );
  }

  @Mutation()
  @Transaction()
  async deleteRelatedPost(
    @Ctx() ctx: RequestContext,
    @Args() args: { id: ID }
  ) {
    return this.taxonomyValueService.deleteRelatedPost(ctx, args.id);
  }

  @Query()
  async getRelatedPosts(
    @Ctx() ctx: RequestContext,
    @Args() args: GetTaxonomyValuesArgs
  ) {
    return this.taxonomyValueService.getRelatedPosts(ctx, args);
  }

  @Query()
  async getRelatedPostById(
    @Ctx() ctx: RequestContext,
    @Args() args: { id: string }
  ) {
    const post = await this.taxonomyValueService.getById(ctx, args.id);

    return {
      ...post,
    };
  }
}
