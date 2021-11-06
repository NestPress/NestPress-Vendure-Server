import gql from "graphql-tag";


export const extendCustomer = gql`
    
    type shortDescription:String
    

    extend type Customer {
        shortDescription: shortDescription
    }
`