import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import {
  ID,
  RequestContext,
  TransactionalConnection,
  UnauthorizedError,
  UserService,
} from "@vendure/core";
import { GetPostsArgs, PostInput, PostsFilter } from "./post.resolver";
import { Post } from "./post.entity";
import { createAdvancedQuery, AdvancedQueryResult } from "../advancedQuery";
import * as uuid from "uuid";
import { PostTaxonomyValue } from "./taxonomy-value.entity";
import { slugify } from "../slugify";
import { PostPermissionService } from "../PostPermission/post-permission.service";

@Injectable()
export class PostService {
  private queryCollection: AdvancedQueryResult<Post, any>;

  constructor(
    private connection: TransactionalConnection,
    private userService: UserService,
    private postPermissionService: PostPermissionService
  ) {
    this.queryCollection = createAdvancedQuery({
      connection,
      entity: Post,
      relations: ["leftRelatedPosts", "rightRelatedPosts", "postTaxonomies"],
      fullTextSearch: {},
      customFilterPropertyMap: {
        postTaxonomiesId: "postTaxonomies.id",
        postTaxonomiesKey: "postTaxonomies.key",
        postTaxonomiesValue: "postTaxonomies.value",
      },
    });
  }
  async getById(ctx: RequestContext, id: string) {
    const user = await this.getActiveUser(ctx);

    const qb = this.queryCollection(ctx, {
      filter: {
        id: {
          eq: id,
        },
      },
    });

    const post = await qb.getQuery().getOne();

    if (!post) {
      throw new NotFoundException();
    }

    await this.postPermissionService.validatePostOrFail(post, user, "read");

    return post;
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
  async getPosts(ctx: RequestContext, args: GetPostsArgs = {}) {
    const user = await this.getActiveUserOrFail(ctx);

    const userCustomTypes =
      await this.postPermissionService.getUserCustomTypePermission(user);

    if (args.filter && !args.filter.customType) {
      args.filter.customType = {
        in: userCustomTypes,
      };
    } else if (
      args.filter &&
      args.filter.customType &&
      !args.filter.customType.in
    ) {
      args.filter.customType.in = userCustomTypes;
    } else if (
      args.filter &&
      args.filter.customType &&
      args.filter.customType.in
    ) {
      args.filter.customType.in =
        args.filter.customType.in.concat(userCustomTypes);
    }

    const qb = this.queryCollection(ctx, {
      ...args,
    });

    return qb.getListWithCount(qb.getQuery());
  }

  private async getActiveUserOrFail(ctx: RequestContext) {
    const user = await this.userService.getUserById(ctx, ctx.activeUserId!);

    if (!user) {
      throw new UnauthorizedError();
    }
    return user;
  }

  private async getActiveUser(ctx: RequestContext) {
    return await this.userService.getUserById(ctx, ctx.activeUserId!);
  }

  async changePostStatus(ctx: RequestContext, id: ID, status: string) {
    const repository = this.connection.getRepository(ctx, Post);

    const user = await this.getActiveUserOrFail(ctx);
    const post = await repository.findOneOrFail(id);

    await this.postPermissionService.validatePostOrFail(post, user, "update");

    await repository.update(id, {
      status: status as any,
    });

    return post;
  }

  async deletePost(ctx: RequestContext, id: ID) {
    const repository = this.connection.getRepository(ctx, Post);

    const user = await this.getActiveUserOrFail(ctx);
    const post = await repository.findOneOrFail(id);

    await this.postPermissionService.validatePostOrFail(post, user, "delete");

    post.slug = `${post.slug}-${uuid.v4()}`;
    await repository.save(post);

    await repository.softDelete(id);

    return id;
  }
  async updatePost(ctx: RequestContext, id: ID, input: PostInput) {
    const repository = this.connection.getRepository(ctx, Post);

    const user = await this.getActiveUserOrFail(ctx);
    const post = await repository.findOneOrFail(id);

    await this.postPermissionService.validatePostOrFail(post, user, "update");

    const updatingPost = Object.assign(post, input);

    await this.mapTaxonomiesInputsToEntities(input, updatingPost);

    return await repository.save(updatingPost);
  }
  async createPost(ctx: RequestContext, input: PostInput) {
    const repository = this.connection.getRepository(ctx, Post);

    const user = await this.userService.getUserById(ctx, ctx.activeUserId!);

    if (!user) {
      throw new UnauthorizedError();
    }

    const post = repository.create({
      ...input,
      author: user,
      // asset,
    });

    await this.postPermissionService.validatePostOrFail(post, user, "create");

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
