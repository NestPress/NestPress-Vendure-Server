import { Customer, PluginCommonModule, VendurePlugin } from "@vendure/core";
import { NestModule, MiddlewareConsumer } from "@nestjs/common";
import { schemaExtension } from "./schema";
import { CUSTOM_PERMISSION_ARR } from "./Permission/customPermission";
import {
  Post,
} from "./Post/post.entity";
import { PostService } from "./Post/post.service";
import { PostResolver } from "./Post/post.resolver";
import { Block } from "./Block/entity";
import { BlockService } from "./Block/service";
import { BlockResolver } from "./Block/resolver";
import { NestPressCustomerService } from "./Customer/service";
import { CustomerResolver } from "./Customer/resolver";
import { TaxonomyValueResolver } from "./Post/taxonomy-value.resolver";
import { TaxonomyValueService } from "./Post/taxonomy-value.service";
import { PostTaxonomyValue } from "./Post/taxonomy-value.entity";
import { RelatedPostResolver } from "./Post/related-post.resolver";
import { RelatedPost } from "./Post/related-post.entity";
import { RelatedPostService } from "./Post/related-post.service";
@VendurePlugin({
  imports: [PluginCommonModule],
  entities: [
    // Profile,
    Post,
    RelatedPost,
    PostTaxonomyValue,
    Block
  ],
  providers: [
    PostService,
    RelatedPostService,
    BlockService,
    TaxonomyValueService,
    NestPressCustomerService
    // ProfileService,
    // AddressService,
  ],
  shopApiExtensions: {
    schema: schemaExtension,
    resolvers: [
      PostResolver,
      RelatedPostResolver,
      BlockResolver,
      TaxonomyValueResolver,
      CustomerResolver
    ]
  },
  adminApiExtensions: {
    schema: schemaExtension,
    resolvers: [
      PostResolver,
      RelatedPostResolver,
      BlockResolver
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
