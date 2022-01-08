import { Resolver, Query, Mutation, Args } from "@nestjs/graphql";

import { Ctx, ID, RequestContext, Transaction } from "@vendure/core";

import { GetListArgs, ListFiltersOperators } from "../common";
import { PostTaxonomyType, PostTaxonomyValue } from "./taxonomy-value.entity";
import {
  CreatePostTaxonomyValueInput,
  UpdatePostTaxonomyValueInput,
} from "./taxonomy-value.inputs";
import { TaxonomyValueService } from "./taxonomy-value.service";

export type PostTaxonomyValueFilter = {
  key: ListFiltersOperators<string>;
  value: ListFiltersOperators<string>;
  type: ListFiltersOperators<PostTaxonomyType>;
  parent: ListFiltersOperators<string>;
};

export type GetTaxonomyValuesArgs = GetListArgs<PostTaxonomyValueFilter>;

@Resolver("TaxonomyValue")
export class TaxonomyValueResolver {
  constructor(private taxonomyValueService: TaxonomyValueService) {}

  @Mutation()
  @Transaction()
  async createPostTaxonomyValue(
    @Ctx() ctx: RequestContext,
    @Args() args: { input: CreatePostTaxonomyValueInput }
  ) {
    return this.taxonomyValueService.createPostTaxonomyValue(ctx, args.input);
  }

  @Mutation()
  @Transaction()
  async updatePostTaxonomyValue(
    @Ctx() ctx: RequestContext,
    @Args() args: { id: ID; input: UpdatePostTaxonomyValueInput }
  ) {
    return this.taxonomyValueService.updatePostTaxonomyValue(
      ctx,
      args.id,
      args.input
    );
  }

  @Mutation()
  @Transaction()
  async deletePostTaxonomyValue(
    @Ctx() ctx: RequestContext,
    @Args() args: { id: ID }
  ) {
    return this.taxonomyValueService.deletePostTaxonomyValue(ctx, args.id);
  }

  @Query()
  async getPostTaxonomyValues(
    @Ctx() ctx: RequestContext,
    @Args() args: GetTaxonomyValuesArgs
  ) {
    return this.taxonomyValueService.getPostTaxonomyValues(ctx, args);
  }

  @Query()
  async getPostTaxonomyValueById(
    @Ctx() ctx: RequestContext,
    @Args() args: { id: string }
  ) {
    const post = await this.taxonomyValueService.getById(ctx, args.id);

    return {
      ...post,
    };
  }
}
