import { Injectable } from "@nestjs/common";
import { ID, RequestContext, TransactionalConnection } from "@vendure/core";
import { GetTaxonomyValuesArgs } from "./taxonomy-value.resolver";
import { createAdvancedQuery, AdvancedQueryResult } from "../advancedQuery";
import { RelatedPost } from "./related-post.entity";
import { CreateRelatedPostInput, UpdateRelatedPostInput } from "./related-post.inputs";

@Injectable()
export class RelatedPostService {
  private queryCollection: AdvancedQueryResult<RelatedPost, any>;

  constructor(private connection: TransactionalConnection) {
    this.queryCollection = createAdvancedQuery({
      connection,
      entity: RelatedPost,
      relations: ['leftPost', 'rightPost'],
      fullTextSearch: {},
      customFilterPropertyMap: {
        leftPost: "leftPost.id",
        rightPost: "rightPost.id",
      },
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
  getRelatedPosts(ctx: RequestContext, args: GetTaxonomyValuesArgs = {}) {
    const qb = this.queryCollection(ctx, args);

    return qb.getListWithCount(qb.getQuery());
  }

  async deleteRelatedPost(ctx: RequestContext, id: ID) {
    const repository = this.connection.getRepository(ctx, RelatedPost);

    await repository.findOneOrFail(id);

    await repository.delete(id);

    return id;
  }
  async updateRelatedPost(
    ctx: RequestContext,
    id: ID,
    input: UpdateRelatedPostInput
  ) {
    const repository = this.connection.getRepository(ctx, RelatedPost);

    await repository.update(id, {
      ...(input as unknown as RelatedPost),
    });

    const post = await repository.findOneOrFail(id);

    return post;
  }
  async createRelatedPost(
    ctx: RequestContext,
    input: CreateRelatedPostInput
  ) {
    const repository = this.connection.getRepository(ctx, RelatedPost);

    const post = repository.create(input as unknown as RelatedPost);

    const createdPost = await repository.save(post);

    const postEntity = await repository.findOneOrFail(createdPost.id, {
      relations: ['leftPost', 'rightPost']
    });

    return postEntity;
  }
}
