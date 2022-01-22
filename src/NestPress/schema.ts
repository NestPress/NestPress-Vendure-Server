import gql from "graphql-tag";
import { extendAssets, shopOnlyAssets } from "./Assets/schema";
import { extendBlock } from "./Block/schema";
import { extendCustomer } from "./Customer/schema";
import { extendPost } from "./Post/schema";
import { postPermissionSchema } from "./PostPermission/schema";

export const schemaExtension = gql`
  ${extendAssets}
  ${extendPost}
  ${extendBlock}
  ${extendCustomer}
`;

export const schemaShopOnlyExtension = gql`
  ${schemaExtension}
  ${shopOnlyAssets}
`;

export const schemaAdminOnlyExtension = gql`
  ${schemaExtension}
  ${postPermissionSchema}
`;
