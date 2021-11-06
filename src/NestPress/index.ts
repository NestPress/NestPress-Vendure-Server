import { Customer, PluginCommonModule, VendurePlugin } from "@vendure/core";
import { NestModule, MiddlewareConsumer } from "@nestjs/common";
import { schemaExtension } from "./schema";
import { CUSTOM_PERMISSION_ARR } from "./Permission/customPermission";
import {
  Post,
  PostTaxonomy,
  PostTaxonomyValue,
  RelatedPost,
  RelatedUser,
} from "./Post/entity";
import { PostService } from "./Post/service";
import { PostResolver } from "./Post/resolver";
@VendurePlugin({
  imports: [PluginCommonModule],
  entities: [
    // Profile,
    Post,
    PostTaxonomy,
    PostTaxonomyValue,
    RelatedPost,
    RelatedUser,
  ],
  providers: [
    PostService,
    // ProfileService,
    // AddressService,
  ],
  shopApiExtensions: {
    schema: schemaExtension,
    resolvers: [
      PostResolver
    ]
  },
  adminApiExtensions: {
    schema: schemaExtension,
    resolvers: [
      PostResolver,
      // AddressResolver,
    ],
  },
  configuration: (config) => {
    config.authOptions.customPermissions.push(...CUSTOM_PERMISSION_ARR);
    config.customFields = {
      ...config.customFields,
      User: [
        {
          name: "shortDescription",
          type: "string",
        },
      ],
      Customer: [
        {
          name: 'posts',
          type: 'relation',
          entity: Post,
          // may be omitted if the entity name matches the GraphQL type name,
          // which is true for all built-in entities.
          graphQLType: 'Post',
          // Whether to "eagerly" load the relation
          // See https://typeorm.io/#/eager-and-lazy-relations
          eager: false,
        }
      ]
    };

    return config;
  },
})
export class NestPress {}
