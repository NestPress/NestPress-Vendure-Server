import { ID } from "@vendure/core";
import { RelatedPost } from "./related-post.entity";

export interface CreateRelatedPostInput {
  key: string;
  value: string;
  parent: RelatedPost;
  categoryPosts: [RelatedPost];
  tagsPosts: [RelatedPost];
}

export interface UpdateRelatedPostInput
  extends CreateRelatedPostInput {
  id: ID;
}
