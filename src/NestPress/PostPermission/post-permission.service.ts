import { Injectable } from "@nestjs/common";
import { ForbiddenError, ID, RequestContext, TransactionalConnection, User } from "@vendure/core";
import { In, Repository } from "typeorm";
import { AdvancedQueryResult, createAdvancedQuery } from "../advancedQuery";
import { Post } from "../Post/post.entity";
import {
  PostOperation,
  PostPermission,
  PostPermissionScope,
} from "./post-permission.entity";
import { CreatePostPermissionInput, UpdatePostPermissionInput } from "./post-permission.inputs";
import { GetPostPermissionArgs } from "./post-permission.resolver";

@Injectable()
export class PostPermissionService {
  constructor(
    private connection: TransactionalConnection
  ) {
    this.queryCollection = createAdvancedQuery({
      connection,
      entity: PostPermission,
      relations: [],
      fullTextSearch: {},
    });
  }

  private queryCollection: AdvancedQueryResult<PostPermission, any>;

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
  getPostPermissions(ctx: RequestContext, args: GetPostPermissionArgs = {}) {
    const qb = this.queryCollection(ctx, args);

    return qb.getListWithCount(qb.getQuery());
  }

  async deletePostPermission(ctx: RequestContext, id: ID) {
    const repository = this.connection.getRepository(ctx, PostPermission);

    await repository.findOneOrFail(id);

    await repository.delete(id);

    return id;
  }
  async updatePostPermission(
    ctx: RequestContext,
    id: ID,
    input: UpdatePostPermissionInput
  ) {
    const repository = this.connection.getRepository(ctx, PostPermission);

    await repository.update(id, {
      ...(input as unknown as PostPermission),
    });

    const post = await repository.findOneOrFail(id);

    return post;
  }
  async createPostPermission(
    ctx: RequestContext,
    input: CreatePostPermissionInput
  ) {
    const repository = this.connection.getRepository(ctx, PostPermission);

    const post = repository.create(input as unknown as PostPermission);

    return await repository.save(post);
  }

  async getUserCustomTypePermission(user: User) {
    const postPermissionRepo = this.connection.getRepository(PostPermission);

    const postPermissions = await postPermissionRepo.find({
      where: {
        role: In(user.roles),
        operation: "list",
      },
    });

    return postPermissions
      .map((postPermission) => {
        return postPermission.shouldAllow ? postPermission.customType : null;
      })
      .filter((value) => !!value);
  }

  async validateList(
    customType: string,
    user: User
  ): Promise<PostPermissionScope | null> {
    const postPermissionRepo = this.connection.getRepository(PostPermission);

    const postPermissions = await postPermissionRepo.find({
      where: {
        customType: customType,
        role: In(user.roles),
        operation: "list",
      },
    });

    let result: PostPermissionScope | null = null;
    for (let i = 0; i < postPermissions.length; i++) {
      const postPermission = postPermissions[i];
      if (postPermission.scope === "author") {
        result = "author";
      } else if (postPermission.scope === "all") {
        return "all";
      }
    }

    return result;
  }

  async validatePostOrFail(
    post: Post,
    user: User | undefined,
    operation: PostOperation
  ) {
    if (!this.validatePermission(post, user, operation)) {
      throw new ForbiddenError();
    }
  }

  async validatePermission(
    post: Post,
    user: User | undefined,
    operation: PostOperation
  ) {
    const postPermissionRepo = this.connection.getRepository(PostPermission);

    const scope = operation !== "create" ? post.author === user : "all";

    const postPermissions = await postPermissionRepo.find({
      where: {
        customType: post.customType,
        role: user ? In(user.roles) : null,
        operation,
        scope,
      },
    });

    if (postPermissions.length === 0) {
      return false;
    }

    const result = postPermissions
      .map((postPermission: PostPermission) => {
        return postPermission.shouldAllow;
      })
      .filter((value) => !value);

    return result.length === 0;
  }
}
