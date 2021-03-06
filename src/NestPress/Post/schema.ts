import gql from "graphql-tag";
export const extendPost = gql`
  enum PostType {
    Comment
    Event
    Facet
    Layout
    Meta
    Page
    Panel
    Post
    Reusable
  }

  enum PostStatus {
    Draft
    Published
    Blocked
    Archive
    Trash
  }

  enum PostTaxonomyType {
    Category
    Tags
  }

  type PostTaxonomyValue {
    id: ID!
    key: String
    value: String
    type: PostTaxonomyType
    parent: PostTaxonomyValue!
    taxonomiesPosts: [PostTaxonomyValue]
  }

  type PostWithBlocks implements Node {
    id: ID!
    createdAt: DateTime!
    updatedAt: DateTime
    publishAt: DateTime
    expireAt: DateTime
    author: User!
    postType: PostType!
    customType: String
    customFields: JSON
    assets: Assets
    status: PostStatus
    title: String!
    slug: String!
    content: String
    leftRelatedPosts: [RelatedPost]
    rightRelatedPosts: [RelatedPost]
    relatedUsers: [RelatedUser]
    blocks: [Block]
    # contentBlocks
    postTaxonomies: [PostTaxonomyValue]
    editors: [User]
  }

  type Post implements Node {
    id: ID!
    createdAt: DateTime!
    updatedAt: DateTime
    publishAt: DateTime
    expireAt: DateTime
    author: User!
    postType: PostType!
    customType: String
    customFields: JSON
    assets: Assets
    status: PostStatus
    title: String!
    slug: String!
    content: String
    leftRelatedPosts: [RelatedPost]
    rightRelatedPosts: [RelatedPost]
    relatedUsers: [RelatedUser]
    # contentBlocks
    postTaxonomies: [PostTaxonomyValue]
    editors: [User]
  }

  input RelatedPostInput {
    leftPost: ID
    rightPost: ID
    relationType: String!
    customFields: JSON
  }

  type RelatedPost {
    id: ID!
    leftPost: Post
    rightPost: Post
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
    slug: String
    # assets: Assets
    leftRelatedPost: [RelatedPostInput]
    rightRelatedPost: [RelatedPostInput]
    relatedUsers: [RelatedUserInput]
    postTaxonomies: [ID]
    editors: [ID]
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
    leftRelatedPost: [RelatedPostInput]
    rightRelatedPost: [RelatedPostInput]
    relatedUsers: [RelatedUserInput]
    postTaxonomies: [ID]
    editors: [ID]
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

  input PostTaxonomyTypeOperators {
    eq: PostTaxonomyType
    notEq: PostTaxonomyType
    contains: PostTaxonomyType
    notContains: PostTaxonomyType
    in: [PostTaxonomyType!]
    notIn: [PostTaxonomyType!]
    regex: PostTaxonomyType
  }

  input CreatePostTaxonomyValueInput {
    key: String
    value: String
    type: PostTaxonomyType!
    parent: ID
  }

  input UpdatePostTaxonomyValueInput {
    key: String
    value: String
    parent: ID
    type: PostTaxonomyType
  }

  input PostTaxonomyValueSingleOperator {
    id: ID
    key: String
    value: String
    parent: ID
    type: PostTaxonomyType
  }

  input PostTaxonomyValueOperators {
    eq: PostTaxonomyValueSingleOperator
    notEq: PostTaxonomyValueSingleOperator
    contains: PostTaxonomyValueSingleOperator
    notContains: PostTaxonomyValueSingleOperator
    in: [PostTaxonomyValueSingleOperator!]
    notIn: [PostTaxonomyValueSingleOperator!]
  }

  input PostsFilter {
    postType: PostTypeOperators
    id: IDOperators
    leftRelatedPostId: IDOperators
    rightRelatedPostId: IDOperators
    leftRelatedPost: JSONOperators,
    rightRelatedPost: JSONOperators,
    postTaxonomiesId: IDOperators
    postTaxonomiesKey: StringOperators
    postTaxonomiesValue: StringOperators
    title: StringOperators
    customType: StringOperators
    customFields: JSONOperators
  }

  type PostsPaginatedResult {
    list: [PostWithBlocks]!
    totalItems: Int!
  }

  type PostTaxonomyValuesPaginatedResult {
    list: [PostTaxonomyValue]!
    totalItems: Int!
  }

  input PostTaxonomyValueFilter {
    key: StringOperators
    value: StringOperators
    parent: IDOperators
    type: PostTaxonomyTypeOperators
  }

  input CreateRelatedPostInput {
    leftPost: ID
    rightPost: ID
    relationType: String
    customFields: JSON
  }

  input UpdateRelatedPostInput {
    id: ID!
    leftPost: ID
    rightPost: ID
    relationType: String
    customFields: JSON
  }

  type RelatedPostsPaginatedResult {
    list: [RelatedPost]!
    totalItems: Int!
  }

  input RelatedPostFilter {
    id: IDOperators
    leftPost: IDOperators
    rightPost: IDOperators
    relationType: StringOperators
    customFields: JSONOperators
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

    getPostTaxonomyValues(
      query: String
      limit: Int
      offset: Int
      filter: PostTaxonomyValueFilter
      sort: JSON
    ): PostTaxonomyValuesPaginatedResult!
    getPostTaxonomyValueById(id: ID!): PostTaxonomyValue

    getRelatedPosts(
      query: String
      limit: Int
      offset: Int
      filter: RelatedPostFilter
      sort: JSON
    ): RelatedPostsPaginatedResult!
    getRelatedPostById(id: ID!): RelatedPost
  }

  extend type Mutation {
    createPost(input: CreatePostInput): Post
    updatePost(id: ID!, input: UpdatePostInput): Post
    changePostStatus(id: ID!, status: PostStatus!): Post
    changePostSlug(id: ID!, slug: String!): Post
    deletePost(id: ID!): ID

    createPostTaxonomyValue(
      input: CreatePostTaxonomyValueInput
    ): PostTaxonomyValue
    updatePostTaxonomyValue(
      id: ID!
      input: UpdatePostTaxonomyValueInput
    ): PostTaxonomyValue
    deletePostTaxonomyValue(id: ID!): ID

    createRelatedPost(input: CreateRelatedPostInput): RelatedPost
    updateRelatedPost(id: ID!, input: UpdateRelatedPostInput): RelatedPost
    deleteRelatedPost(id: ID!): ID
  }
`;
