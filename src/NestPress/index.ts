import { Customer, PluginCommonModule, VendurePlugin } from "@vendure/core";
import { NestModule, MiddlewareConsumer } from "@nestjs/common";
import { compileUiExtensions } from "@vendure/ui-devkit/compiler";
import path from "path";
import { AdminUiPlugin } from "@vendure/admin-ui-plugin";
import { VendureConfig } from "@vendure/core";
import { schemaAdminOnlyExtension, schemaExtension, schemaShopOnlyExtension } from "./schema";
import { CUSTOM_PERMISSION_ARR } from "./Permission/customPermission";
import { Post } from "./Post/post.entity";
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
import { AssetShopResolver } from "./Assets/resolver.shop";
import { PostPermissionService } from "./PostPermission/post-permission.service";
import { PostPermission } from "./PostPermission/post-permission.entity";
import { PostPermissionResolver } from "./PostPermission/post-permission.resolver";

@VendurePlugin({
  imports: [PluginCommonModule],
  entities: [
    // Profile,
    Post,
    RelatedPost,
    PostTaxonomyValue,
    Block,
    PostPermission,
  ],
  providers: [
    PostService,
    RelatedPostService,
    BlockService,
    TaxonomyValueService,
    NestPressCustomerService,
    PostPermissionService,
    // ProfileService,
    // AddressService,
  ],
  shopApiExtensions: {
    schema: schemaShopOnlyExtension,
    resolvers: [
      PostResolver,
      RelatedPostResolver,
      BlockResolver,
      TaxonomyValueResolver,
      CustomerResolver,
      AssetShopResolver,
    ],
  },
  adminApiExtensions: {
    schema: schemaAdminOnlyExtension,
    resolvers: [
      PostResolver,
      RelatedPostResolver,
      BlockResolver,
      PostPermissionResolver,
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
          name: "posts",
          type: "relation",
          entity: Post,
          // may be omitted if the entity name matches the GraphQL type name,
          // which is true for all built-in entities.
          graphQLType: "Post",
          // Whether to "eagerly" load the relation
          // See https://typeorm.io/#/eager-and-lazy-relations
          eager: false,
        },
      ],
    };

    config.plugins = config.plugins.concat(
      AdminUiPlugin.init({
        port: 5001,
        route: '/admin',
        app: compileUiExtensions({
          outputPath: path.join(__dirname, "admin-ui", "src"),
          extensions: [
            {
              extensionPath: path.join(__dirname, "ui-extensions"),
              ngModules: [
                {
                  type: "lazy",
                  route: "greet",
                  ngModuleFileName: "post-permission.module.ts",
                  ngModuleName: "PostPermissionModule",
                },
              ],
            },
          ],
        }),
      })
    );

    return config;
  },
})
export class NestPress {}
