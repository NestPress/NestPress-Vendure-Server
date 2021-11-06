/*
  # global properties

  type Profile - is rout custom profiletype wich will joined to vendure Administrator type. fill it with any properties yu wll need
  CreateAdministratorWithProfileInput - fitst 4 fields are required! add any additional fields you will use while creating new administratir with custom profile
* 
*/

import gql from "graphql-tag";

// #types


// #inputs

const profileSchema = gql`
  
  type Profile {
    
    blocked: Boolean!

    # extended in physicalAddressSchema
    # physicalAddress: PhysicalAddress

    # Languages - void extention 
    # languages: [String]

    # Assets - void extention 
    # assets: [OrderableAsset]
    # featuredAsset: Asset
  }

  type ProfilesPaginatedResult {
    list: [Administrator]!
    totalItems: Int!
  }

  extend type Administrator {
    profile: Profile!
  }

  extend type Query {
    # if you want to create additional queries for your admin with profile-add it here, otherwise - delete
    getProfiles: ProfilesPaginatedResult
    getProfileById(id: ID!): Administrator
  }


  


  input CreateAdministratorWithProfileInput {
    firstName: String 
    lastName: String
    emailAddress: String!
    password: String!

    # Languages - void extention 
    # languages: [String]

    # extended in physicalAddressSchema
    # physicalAddress: PhysicalAddressInput
    
    # add additional fields here
  }

  extend type Mutation {
    # add creation mutation here
    registerAdministratorWithProfile(input: CreateAdministratorWithProfileInput!): Administrator
  }
`;

const AddressSchema = gql`
  type PhysicalAddress {
    postalCode: String
    city: String
    street: String
    region: String
  }

  input PhysicalAddressInput {
    postalCode: String
    city: String
    street: String
    region: String
  }

  extend type Query {
    getPhysicalAddresses: PhysicalAddress
  }

  extend type Mutation {
    # add creation mutation here
    createPhysicalAddress(input: PhysicalAddressInput!): PhysicalAddress
  }
`;

const assets = gql`
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



export const schemaExtension = gql`
  
 
`;
// ${profileSchema}
 // ${addressSchema}
 // ${assets}