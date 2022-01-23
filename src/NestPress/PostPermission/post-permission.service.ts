import { Injectable } from "@nestjs/common";
import {
  ForbiddenError,
  ID,
  RequestContext,
  TransactionalConnection,
  User,
} from "@vendure/core";
import { Any, In, Raw, Repository } from "typeorm";
import { AdvancedQueryResult, createAdvancedQuery } from "../advancedQuery";
import { Post } from "../Post/post.entity";
import {
  PostOperation,
  PostPermission,
  PostPermissionScope,
} from "./post-permission.entity";
import {
  CreatePostPermissionInput,
  UpdatePostPermissionInput,
} from "./post-permission.inputs";
import { GetPostPermissionArgs } from "./post-permission.resolver";

@Injectable()
export class PostPermissionService {
  constructor(private connection: TransactionalConnection) {
    this.queryCollection = createAdvancedQuery({
      connection,
      entity: PostPermission,
      relations: ["role"],
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

    const post = await repository.findOneOrFail(id, {
      relations: ["role"],
    });

    return post;
  }
  async createPostPermission(
    ctx: RequestContext,
    input: CreatePostPermissionInput
  ) {
    const repository = this.connection.getRepository(ctx, PostPermission);

    const post = repository.create(input as unknown as PostPermission);

    const createdPost = await repository.save(post);

    return repository.findOneOrFail(createdPost.id, {
      relations: ["role"],
    });
  }

  async getUserCustomTypeDenyPermission(user: User) {
    const postPermissionRepo = this.connection.getRepository(PostPermission);

    const postPermissions = await postPermissionRepo
      .createQueryBuilder("postPermission")
      .innerJoinAndSelect("postPermission.role", "role")
      .where("role.id IN(:...id)", { id: user.roles.map((role) => role.id) })
      .andWhere("postPermission.operation = 'list'")
      .andWhere("postPermission.shouldAllow = false")
      .getMany();

    return postPermissions.map((postPermission) => postPermission.customType);
  }

  async validateList(
    customType: string,
    user: User
  ): Promise<PostPermissionScope | null> {
    const postPermissionRepo = this.connection.getRepository(PostPermission);

    const postPermissions = await postPermissionRepo
      .createQueryBuilder("postPermission")
      .innerJoinAndSelect("postPermission.role", "role")
      .where("role.id IN(:...id)", { id: user.roles.map((role) => role.id) })
      .andWhere("postPermission.operation = 'list'")
      .andWhere("postPermission.shouldAllow = false")
      .andWhere("postPermission.customType = :customType", {
        customType,
      })
      .getMany();

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
    if (!(await this.validatePermission(post, user, operation))) {
      throw new ForbiddenError();
    }
  }

  async validatePermission(
    post: Post,
    user: User | undefined,
    operation: PostOperation
  ) {
    const scope =
      operation !== "create"
        ? post.author === user
          ? "author"
          : "all"
        : "all";

    if (!user) {
      return false;
    }

    const postPermissionRepo = this.connection.getRepository(PostPermission);

    const postPermissions = await postPermissionRepo
      .createQueryBuilder("postPermission")
      .innerJoinAndSelect("postPermission.role", "role")
      .where("role.id IN(:...id)", { id: user.roles.map((role) => role.id) })
      .andWhere("postPermission.operation = :operation", {
        operation,
      })
      .andWhere("postPermission.scope = :scope", {
        scope,
      })
      .andWhere("postPermission.customType = :customType", {
        customType: post.customType
      })
      .getMany();

    if (postPermissions.length === 0) {
      return true;
    }

    const result = postPermissions
      .map((postPermission: PostPermission) => {
        return postPermission.shouldAllow;
      })
      .filter((value) => !Boolean(value));

    return result.length === 0;
  }
}
