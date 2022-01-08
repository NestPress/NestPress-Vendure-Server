import { Injectable } from "@nestjs/common";
import { ID, RequestContext, TransactionalConnection } from "@vendure/core";
import { GetTaxonomyValuesArgs } from "./taxonomy-value.resolver";
import { createAdvancedQuery, AdvancedQueryResult } from "../advancedQuery";
import { PostTaxonomyValue } from "./taxonomy-value.entity";
import {
  CreatePostTaxonomyValueInput,
  UpdatePostTaxonomyValueInput,
} from "./taxonomy-value.inputs";

@Injectable()
export class TaxonomyValueService {
  private queryCollection: AdvancedQueryResult<PostTaxonomyValue, any>;

  constructor(private connection: TransactionalConnection) {
    this.queryCollection = createAdvancedQuery({
      connection,
      entity: PostTaxonomyValue,
      relations: [],
      fullTextSearch: {},
    });
  }
  getById(ctx: RequestContext, id: string) {
    const qb = this.queryCollection(ctx, {
      filter: {
        id: {
          eq: id,
        },
      },
    });

    return qb.getQuery().getOne();
  }
  getPostTaxonomyValues(ctx: RequestContext, args: GetTaxonomyValuesArgs = {}) {
    const qb = this.queryCollection(ctx, args);

    return qb.getListWithCount(qb.getQuery());
  }

  async deletePostTaxonomyValue(ctx: RequestContext, id: ID) {
    const repository = this.connection.getRepository(ctx, PostTaxonomyValue);

    await repository.findOneOrFail(id);

    await repository.delete(id);

    return id;
  }
  async updatePostTaxonomyValue(
    ctx: RequestContext,
    id: ID,
    input: UpdatePostTaxonomyValueInput
  ) {
    const repository = this.connection.getRepository(ctx, PostTaxonomyValue);

    await repository.update(id, {
      ...(input as unknown as PostTaxonomyValue),
    });

    const post = await repository.findOneOrFail(id);

    return post;
  }
  async createPostTaxonomyValue(
    ctx: RequestContext,
    input: CreatePostTaxonomyValueInput
  ) {
    const repository = this.connection.getRepository(ctx, PostTaxonomyValue);

    const post = repository.create(input as unknown as PostTaxonomyValue);

    return await repository.save(post);
  }
}
