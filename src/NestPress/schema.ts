import gql from "graphql-tag";
import { extendAssets } from "./Assets/schema";
import { extendBlock } from "./Block/schema";
import { extendCustomer } from "./Customer/schema";
import { extendPost } from "./Post/schema";

export const schemaExtension = gql`
  ${extendAssets}
  ${extendPost}
  ${extendBlock}
  ${extendCustomer}
`;
