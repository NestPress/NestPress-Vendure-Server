import { Injectable } from "@nestjs/common";
import { ID, RequestContext } from "@vendure/core";
import { GetPostsArgs, PostInput } from "./resolver";

@Injectable()
export class PostService {
  getById(ctx: RequestContext, id: string) {
    throw new Error("Method not implemented.");
  }
  getPosts(ctx: RequestContext, args: GetPostsArgs) {
    throw new Error("Method not implemented.");
  }
  changePostStatus(ctx: RequestContext, id: ID, status: string) {
    throw new Error("Method not implemented.");
  }
  deletePost(ctx: RequestContext, id: ID) {
    throw new Error("Method not implemented.");
  }
  updatePost(ctx: RequestContext, id: ID, input: PostInput) {
    throw new Error("Method not implemented.");
  }
  createPost(ctx: RequestContext, input: PostInput) {
    throw new Error("Method not implemented.");
  }
}
