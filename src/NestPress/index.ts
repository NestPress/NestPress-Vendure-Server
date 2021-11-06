import { PluginCommonModule, VendurePlugin } from "@vendure/core";
import { NestModule, MiddlewareConsumer } from "@nestjs/common";
import { schemaExtension } from "./schema";
import { CUSTOM_PERMISSION_ARR }  from "./Permission/customPermission";
@VendurePlugin({
  entities: [
    // Profile,
  ],
  providers: [  
    // ProfileService,
    // AddressService,
  ],
  adminApiExtensions: {
    schema: schemaExtension,
    resolvers: [
      // ProfileResolver,
      // AddressResolver,
    ],
  },
  configuration: (config) => {
    config.authOptions.customPermissions.push(...CUSTOM_PERMISSION_ARR);
    config.customFields = {
      ...config.customFields,
      User: [
        {
          name: 'shortDescription',
          type: 'string'
        }
      ]
    }

    return config;
  },
})
export class NestPress {}