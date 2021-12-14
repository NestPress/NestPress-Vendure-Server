import gql from "graphql-tag";

export const extendCustomer = gql`
    type CustomersPaginatedResult {
        list: [Customer]!
        totalItems: Int!
    }

    extend type Query {
        getCustomers(
          query: String
          limit: Int
          offset: Int
          filter: JSON
          sort: JSON
        ): CustomersPaginatedResult!
        getCustomerById(id: ID!): Customer
    }
`;
