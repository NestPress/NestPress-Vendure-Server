import gql from "graphql-tag";

export const extendAssets = gql`
  type Assets {
    gallery: [OrderableAsset]
    featuredImage: Asset
  }

  extend type Customer {
    assets: Assets
  }

  type OrderableAsset {
    id: ID!
    createdAt: DateTime!
    updatedAt: DateTime!
    assetId: ID!
    position: Int!
    asset: Asset!
  }
  extend type Query {
    getAssetsById(ids: [ID!]!): [Asset]!
  }

  input UpdateAssetFileInput {
    id: ID!
    file: Upload!
  }

  #extend type Mutation {
  #  updateAssetFile(input: UpdateAssetFileInput!): CreateAssetResult!
  #}
`;

export const shopOnlyAssets = gql`
  type MimeTypeError implements ErrorResult {
    errorCode: ErrorCode!
    message: String!
    fileName: String!
    mimeType: String!
  }

  union CreateAssetResult = Asset | MimeTypeError

  input CreateAssetInput {
    file: Upload!
    tags: [String!]
  }

  extend type Mutation {
    #  updateAssetFile(input: UpdateAssetFileInput!): CreateAssetResult!
    createAssets(input: [CreateAssetInput!]!): [CreateAssetResult!]!
  }
`;
