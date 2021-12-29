import gql from "graphql-tag";
export const extendPost = gql`

  enum PostType {
    Post
    Page
    Layout
    Panel
    Comment
    Event
    Facet
    Meta
  }

  enum PostStatus {
    Draft
    Published
    Blocked
    Archive
    Trash
  }


  type PostTaxonomyValue {
    id: ID!
    key: String
    value: String
    parent: PostTaxonomyValue!
  }

  input PostTaxonomyValueInput {
    id: ID!
  }

  type PostTaxonomy {
    postCategories: [PostTaxonomyValue]
    postTags: [PostTaxonomyValue]
  }

  type PostWithBlocks implements Node {
    id: ID!
    createdAt: DateTime!
    updatedAt: DateTime
    publishAt: DateTime 
    expireAt: DateTime
    createdBy: Customer!
    postType: PostType!
    customType: String
    customFields: JSON
    assets: Assets
    status: PostStatus
    title: String!
    slug: String!
    content: String
    taxonomy: [PostTaxonomy]
    relatedPosts: [RelatedPost]
    relatedUsers: [RelatedUser]
    blocks: [Block]
    # contentBlocks 
  }

  type Post implements Node {
    id: ID!
    createdAt: DateTime!
    updatedAt: DateTime
    publishAt: DateTime 
    expireAt: DateTime
    createdBy: Customer!
    postType: PostType!
    customType: String
    customFields: JSON
    assets: Assets
    status: PostStatus
    title: String!
    slug: String!
    content: String
    taxonomy: [PostTaxonomy]
    relatedPosts: [RelatedPost]
    relatedUsers: [RelatedUser]
    # contentBlocks 
  }

  input RelatedPostInput {
    postID: ID!
    relationType: String!
    customFields: JSON
  }

  type RelatedPost {
    post: Post!
    relationType: String!
    customFields: JSON
  }

  input RelatedUserInput {
    userID: ID!
    relationType: String!
    customFields: JSON
  }

  type RelatedUser {
    user: User!
    relationType: String!
    customFields: JSON
  }


  input CreatePostInput {
    publishAt: DateTime 
    expireAt: DateTime
    postType: PostType
    customType: String
    customFields: JSON
    title: String!
    content: String
    slug: String!
    # assets: Assets
    # taxonomy: [PostTaxonomy]
    relatedPosts: [RelatedPostInput]
    relatedUsers: [RelatedUserInput]
  }

  input UpdatePostInput {
    publishAt: DateTime 
    expireAt: DateTime
    postType: PostType
    title: String
    content: String
    slug: String
    customType: String
    customFields: JSON
    # assets: Assets
    # taxonomy: [PostTaxonomy]
    relatedPosts: [RelatedPostInput]
    relatedUsers: [RelatedUserInput]
  }

  extend type Mutation {
    createPost(input: CreatePostInput): Post
    updatePost(id: ID!,input: UpdatePostInput): Post
    changePostStatus(id: ID!, status:PostStatus!): Post
    changePostSlug(id: ID!, slug:String!): Post
    deletePost(id: ID!): ID 
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


  input IDOperators {
    eq: ID
    notEq: ID
    contains: ID
    notContains: ID
    in: [ID!]
    notIn: [ID!]
    regex: ID
  }

  input JSONOperators {
    eq: JSON
    notEq: JSON
  }

  input PostTaxonomyValueOperators {
    eq: PostTaxonomyValueInput
    notEq: PostTaxonomyValueInput
    contains: PostTaxonomyValueInput
    notContains: PostTaxonomyValueInput
    in: [PostTaxonomyValueInput!]
    notIn: [PostTaxonomyValueInput!]
    regex: PostTaxonomyValueInput 
  }

  input PostsFilter {
    postType: PostTypeOperators
    id: IDOperators
    category: PostTaxonomyValueOperators
    tags: PostTaxonomyValueOperators
    title: StringOperators
    customType: StringOperators
    customFields: JSONOperators
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
      sort: JSON
    ): PostsPaginatedResult!
    getPostById(id: ID!): PostWithBlocks
    getPostBySlug(slug: String!): PostWithBlocks
  }
`;