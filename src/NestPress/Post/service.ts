import { Injectable } from "@nestjs/common";
import { ID, RequestContext, TransactionalConnection } from "@vendure/core";
import { GetPostsArgs, PostInput, PostsFilter } from "./resolver";
import { Post } from "./entity";
import { createAdvancedQuery, AdvancedQueryResult } from "../advancedQuery";

@Injectable()
export class PostService {
  private queryCollection: AdvancedQueryResult<Post, any>;

  constructor(private connection: TransactionalConnection) {
    this.queryCollection = createAdvancedQuery({
      connection,
      entity: Post,
      relations: ["relatedPosts", "relatedUsers"],
      fullTextSearch: {}
    });
  }
  getById(ctx: RequestContext, id: string) {
    const qb = this.queryCollection(ctx, {
      filter: {
        id: {
          eq: id
        }
      }
    });

    return qb.getQuery().getOne();
  }
  getPosts(ctx: RequestContext, args: GetPostsArgs = {}) {
    const qb = this.queryCollection(ctx, args);

    return qb.getListWithCount(qb.getQuery());
  }
  async changePostStatus(ctx: RequestContext, id: ID, status: string) {
    const repository = this.connection.getRepository(ctx, Post);

    await repository.update(id, {
      status: status as any
    });

    const post = await repository.findOneOrFail(id);

    return post;
  }

  async deletePost(ctx: RequestContext, id: ID) {
    const repository = this.connection.getRepository(ctx, Post);

    repository.softDelete(id);

    return id;
  }
  async updatePost(ctx: RequestContext, id: ID, input: PostInput) {
    const repository = this.connection.getRepository(ctx, Post);

    await repository.update(id, {
      ...input
    });

    const post = await repository.findOneOrFail(id);

    return post;
  }
  async createPost(ctx: RequestContext, input: PostInput) {
    const repository = this.connection.getRepository(ctx, Post);
    const post = repository.create({
      ...input,
      // asset,
    });
    return await repository.save(post);
  }
}
