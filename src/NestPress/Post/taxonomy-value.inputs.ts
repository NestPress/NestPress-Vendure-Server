import { ID } from "@vendure/core";
import { PostTaxonomyValue } from "./taxonomy-value.entity";

export interface CreatePostTaxonomyValueInput {
  key: string;
  value: string;
  parent: PostTaxonomyValue;
  categoryPosts: [PostTaxonomyValue];
  tagsPosts: [PostTaxonomyValue];
}

export interface UpdatePostTaxonomyValueInput
  extends CreatePostTaxonomyValueInput {
  id: ID;
}
