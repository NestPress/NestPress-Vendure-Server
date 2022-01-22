import { ID } from "@vendure/core";
import { PostPermission } from "./post-permission.entity";

export interface CreatePostPermissionInput {
  key: string;
  value: string;
  parent: PostPermission;
  categoryPosts: [PostPermission];
  tagsPosts: [PostPermission];
}

export interface UpdatePostPermissionInput
  extends CreatePostPermissionInput {
  id: ID;
}
