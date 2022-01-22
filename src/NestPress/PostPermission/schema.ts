import { gql } from "apollo-server-express";

export const postPermissionSchema = gql`

enum PostOperation {
    create
    update
    delete
    read
    list
}

enum PostPermissionScope {
    author
    all
}

type PostPermission {
    id: ID!
    operation: PostOperation!
    role: Role!
    shouldAllow: Boolean!
    scope: PostPermissionScope!
    customType: String
}

input CreatePostPermissionInput {
    operation: PostOperation!
    role: ID!
    shouldAllow: Boolean!
    scope: PostPermissionScope!
    customType: String
}

input UpdatePostPermissionInput {
    operation: PostOperation!
    role: ID!
    shouldAllow: Boolean!
    scope: PostPermissionScope!
    customType: String
}

input PostPermissionFilter {
    postType: PostTypeOperators
    id: IDOperators
    postTaxonomiesId: IDOperators
    postTaxonomiesKey: StringOperators
    postTaxonomiesValue: StringOperators
    title: StringOperators
    customType: StringOperators
    customFields: JSONOperators
  }

  type PostPermissionsPaginatedResult {
    list: [PostPermission]!
    totalItems: Int!
  }

  extend type Query {
    getPostPermissions(
      query: String
      limit: Int
      offset: Int
      filter: PostPermissionFilter
      sort: JSON
    ): PostPermissionsPaginatedResult!
    getPostPermissionById(id: ID!): PostPermission
  }

  extend type Mutation {
    createPostPermission(input: CreatePostPermissionInput): PostPermission
    updatePostPermission(id: ID!, input: UpdatePostPermissionInput): PostPermission
    deletePostPermission(id: ID!): ID
  }
`;
