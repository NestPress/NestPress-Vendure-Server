import gql from "graphql-tag";
import { extendAssets } from "./Assets/schema"
import { extendPost } from "./Post/schema"

export const schemaExtension = gql`
    ${ extendAssets } 
    ${ extendPost } 
`;