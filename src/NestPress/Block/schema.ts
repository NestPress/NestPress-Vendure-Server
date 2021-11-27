import gql from "graphql-tag";
export const extendBlock = gql`

  type Block {
    id: String!
    parentId: String
    block: String!
    post: String
    attrs: JSON
  }

  type BlockWithChildren {
    id: String!
    parentId: String
    block: String!
    post: String
    attrs: JSON
    children: [Block]
  }

  input CreateBlockInput {
    id: String!
    parentId: String
    block: String!
    post: String
    attrs: JSON
  }

  input UpdateBlockInput {
    id: String!
    parentId: String!
    block: String!
    post: String
    attrs: JSON
  }

  extend type Mutation {
    createBlock(input: CreateBlockInput): Block
    updateBlock(id: String!, input: UpdateBlockInput): Block
    deleteBlock(id: String!): String 
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
    ): BlocksPaginatedResult!

    getBlockById(id: String!): Block
    getBlockByIdWithChildren(id: String!): BlockWithChildren
  }
`;
