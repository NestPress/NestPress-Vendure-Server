import { Injectable } from "@nestjs/common";
import { ID, RequestContext, TransactionalConnection } from "@vendure/core";
import { GetPostsArgs, PostInput } from "./resolver";
import { Post } from "./entity";

@Injectable()
export class PostService {
  constructor(private connection: TransactionalConnection) {}
  getById(ctx: RequestContext, id: string) {
    throw new Error("Method not implemented.");
  }
  getPosts(ctx: RequestContext, args: GetPostsArgs) {
    throw new Error("Method not implemented.");
  }
  changePostStatus(ctx: RequestContext, id: ID, status: string) {
    throw new Error("Method not implemented.");
  }
  async deletePost(ctx: RequestContext, id: ID) {
    const repository = this.connection.getRepository(ctx, Post);

    repository.softDelete(id);

    return id;
  }
  updatePost(ctx: RequestContext, id: ID, input: PostInput) {
    throw new Error("Method not implemented.");
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
