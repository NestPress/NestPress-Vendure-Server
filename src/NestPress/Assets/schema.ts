import gql from "graphql-tag";
export const extendAssets = gql`
  
  type Assets {
    gallery: [OrderableAsset]
    featuredImage: Asset
  }

  extend type Customer {
    assets: Assets!
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

  extend type Mutation {
    updateAssetFile(input: UpdateAssetFileInput!): CreateAssetResult!
  }
`;