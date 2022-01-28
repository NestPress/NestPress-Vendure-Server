import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { Ctx, Transaction, RequestContext, AssetService, Asset } from "@vendure/core";
import {
  CreateAssetResult,
  MutationCreateAssetsArgs,
} from "@vendure/common/lib/generated-types";

@Resolver("Asset")
export class AssetShopResolver {
  constructor(private assetService: AssetService) {}

  @Mutation()
  @Transaction()
  async createAssets(
    @Ctx() ctx: RequestContext,
    @Args() args: MutationCreateAssetsArgs
  ) {
    const assets: CreateAssetResult[] = [];
    for (const input of args.input) {
      const asset = await this.assetService.create(ctx, input);
      assets.push(asset);
    }

    // admin api doesn't return the __typename field
    return assets.map((a) =>
      "id" in a
        ? { ...a, __typename: "Asset" }
        : { ...a, __typename: "MimeTypeError" }
    );
  }

  @Query()
  @Transaction()
  async getAssetsById(
    @Ctx() ctx: RequestContext,
    @Args() args: { ids: string[] }
  ) {
    let result: Asset[] = [];
    for (let i = 0; i < args.ids.length; i++) {
      const one = await this.assetService.findOne(ctx, args.ids[i]);

      if (one) {
        result.push(one);
      }
    }

    return result;
  }
}
