import gql from "graphql-tag";
export const extendPost = gql`

  enum PostType {
    Post
    Page
    Comment
  }

  enum PostStatus {
    Draft
    Published
    Blocked
    Archive
    Trash
  }

  type Post implements Node {
    id: ID!
    createdAt: DateTime!
    updatedAt: DateTime
    pendingFor: DateTime
    activeUntil: DateTime
    type: PostType!
    asset: Asset!
    status: PostStatus
    title: String!
    slug: String!
    content: String
    fecet:[Facet]
    # relatedPosts
    # relatedUser
    # contentBlocks 
  }

  input PostInput {
    type: PostType!
    title: String!
    content: String
  }

  extend type Mutation {
    createPost(input: PostInput): Post
    updatePost(input: PostInput): Post
    changePostStatus(id: ID!): Post
  }

  input PostTypeOperators {
    eq: PostType
    notEq: PostType
    contains: PostType
    notContains: PostType
    in: [PostType!]
    notIn: [PostType!]
    regex: PostType
  }

  input PostsFilter {
    type: PostTypeOperators
    # id: IDOperators
    # category: PostCategoryOperators;
  }

  type PostsPaginatedResult {
    list: [Post]!
    totalItems: Int!
  }

  extend type Query {
    getPosts(
      query: String
      limit: Int
      offset: Int
      filter: PostsFilter
    ): PostsPaginatedResult!
    getPostById(id: ID!): Post
  }
`;