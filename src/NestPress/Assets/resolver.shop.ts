import { Args, Mutation, Resolver } from "@nestjs/graphql";
import { Ctx, Transaction, RequestContext, AssetService } from "@vendure/core";
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
}
