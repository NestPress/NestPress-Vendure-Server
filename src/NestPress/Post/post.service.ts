import { BadRequestException, Injectable } from "@nestjs/common";
import { ID, RequestContext, TransactionalConnection } from "@vendure/core";
import { GetPostsArgs, PostInput, PostsFilter } from "./post.resolver";
import { Post } from "./post.entity";
import { createAdvancedQuery, AdvancedQueryResult } from "../advancedQuery";
import * as uuid from "uuid";
import { PostTaxonomyValue } from "./taxonomy-value.entity";
import { slugify } from "../slugify";

@Injectable()
export class PostService {
  private queryCollection: AdvancedQueryResult<Post, any>;

  constructor(private connection: TransactionalConnection) {
    this.queryCollection = createAdvancedQuery({
      connection,
      entity: Post,
      relations: ["relatedPosts", "postTaxonomies"],
      fullTextSearch: {},
      customFilterPropertyMap: {
        postTaxonomiesId: "postTaxonomies.id",
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
  getBySlug(ctx: RequestContext, slug: string) {
    const qb = this.queryCollection(ctx, {
      filter: {
        slug: {
          eq: slug,
        },
      },
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
      status: status as any,
    });

    const post = await repository.findOneOrFail(id);

    return post;
  }

  async deletePost(ctx: RequestContext, id: ID) {
    const repository = this.connection.getRepository(ctx, Post);

    const post = await repository.findOneOrFail(id);

    post.slug = `${post.slug}-${uuid.v4()}`;
    await repository.save(post);

    await repository.softDelete(id);

    return id;
  }
  async updatePost(ctx: RequestContext, id: ID, input: PostInput) {
    const repository = this.connection.getRepository(ctx, Post);

    await repository.findOneOrFail(id);

    const post = await repository.findOneOrFail(id);

    const updatingPost = Object.assign(post, input);

    await this.mapTaxonomiesInputsToEntities(input, updatingPost);

    return await repository.save(updatingPost);
  }
  async createPost(ctx: RequestContext, input: PostInput) {
    const repository = this.connection.getRepository(ctx, Post);

    const post = repository.create({
      ...input,
      // asset,
    });

    if (!input.slug) {
      post.slug = await this.generateSlug(ctx, input.title);
    }

    await this.mapTaxonomiesInputsToEntities(input, post);

    return await repository.save(post);
  }

  private async generateSlug(ctx: RequestContext, title: string) {
    const repository = this.connection.getRepository(ctx, Post);

    const simpleSlug = slugify(title);

    let currentSlug = simpleSlug;

    const numbersCheck = new RegExp("^[0-9]*$");

    let foundSlug: string | null = null;
    while (!foundSlug) {
      const entity = await repository.findOne({
        slug: currentSlug,
      });

      if (entity) {
        const splitted = currentSlug.split("-");
        const lastSegment = splitted[splitted.length - 1];

        if (numbersCheck.test(lastSegment)) {
          splitted.pop();
          currentSlug =
            splitted.join("-") + `-${parseInt(lastSegment, 10) + 1}`;
        } else {
          currentSlug = simpleSlug + "-1";
        }
      } else {
        foundSlug = currentSlug;
      }
    }

    return foundSlug;
  }

  private async mapTaxonomiesInputsToEntities(input: PostInput, post: Post) {
    if (input.postTaxonomies) {
      const postTaxonomiesRepo =
        this.connection.getRepository(PostTaxonomyValue);
      for (let i = 0; i < input.postTaxonomies.length; i++) {
        await postTaxonomiesRepo.findOneOrFail(input.postTaxonomies[i]);
      }

      post.postTaxonomies = input.postTaxonomies.map((id) => {
        return {
          id,
        };
      }) as any;
    }
  }
}
