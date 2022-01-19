import { ID } from "@vendure/core";
import { RelatedPost } from "./related-post.entity";

export interface CreateRelatedPostInput {
  postID: ID,
  relationType: string,
  customFields: any
}

export interface UpdateRelatedPostInput
  extends CreateRelatedPostInput {
  id: ID;
}
