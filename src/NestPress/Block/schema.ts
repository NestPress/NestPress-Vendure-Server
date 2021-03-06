import gql from "graphql-tag";
export const extendBlock = gql`

  type Block {
    id: String!
    parentId: String
    block: String!
    post: String
    attrs: JSON
    order: Int
  }

  type BlockWithChildren {
    id: String!
    parentId: String
    block: String
    post: String
    attrs: JSON
    children: [Block]
    order: Int
  }

  input CreateBlockInput {
    id: String!
    parentId: String
    block: String!
    post: String
    attrs: JSON
    order: Int
  }

  input UpdateBlockInput {
    id: String!
    parentId: String
    block: String
    post: String
    attrs: JSON
    order: Int
  }

  input CreateBlocksInput {
    blocks: [CreateBlockInput]!
  }

  input UpdateBlocksInput {
    blocks: [UpdateBlockInput]!
  }

  input DeleteBlocksInput {
    blocks: [String]!
  }

  extend type Mutation {
    createBlock(input: CreateBlockInput): Block
    createBlocks(input: CreateBlocksInput): [Block]
    updateBlock(id: String!, input: UpdateBlockInput): Block
    updateBlocks(input: UpdateBlocksInput): [Block]
    deleteBlock(id: String!): String
    deleteBlocks(input: DeleteBlocksInput): [String]
  }

  input BlockIDOperators {
    eq: String
    notEq: String
    contains: String
    notContains: String
    in: [String!]
    notIn: [String!]
    regex: String
  }

  input BlockPostOperators {
    eq: String
    notEq: String
    contains: String
    notContains: String
    in: [String!]
    notIn: [String!]
    regex: String
  }

  input BlocksFilter {
    parentId: BlockIDOperators
    post: BlockPostOperators
  }

  type BlocksPaginatedResult {
    list: [Block]!
    totalItems: Int!
  }

  extend type Query {
    getBlocks(
      query: String
      limit: Int
      offset: Int
      filter: BlocksFilter
      sort: JSON
    ): BlocksPaginatedResult!

    getBlockById(id: String!): Block
    getBlockByIdWithChildren(id: String!): BlockWithChildren
  }
`;
