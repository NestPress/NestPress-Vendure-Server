import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { Ctx, ID, RequestContext, Transaction } from "@vendure/core";
import { GetListArgs, ListFiltersOperators } from "../common";
import { Block } from "./entity";
import { BlockService } from "./service";

export type BlockInput = {
  parentId: string;
  block: string;
  post?: string;
  attrs: any;
};

export type BlocksFilter = {
  post?: ListFiltersOperators<string>;
  parentId?: ListFiltersOperators<string>;
};

export type GetBlocksArgs = GetListArgs<BlocksFilter>;

@Resolver("Block")
export class BlockResolver {
  constructor(private blockService: BlockService) {}

  @Mutation()
  @Transaction()
  async createBlock(
    @Ctx() ctx: RequestContext,
    @Args() args: { input: BlockInput }
  ) {
    return this.blockService.createBlock(ctx, args.input);
  }

  @Mutation()
  @Transaction()
  async updateBlock(
    @Ctx() ctx: RequestContext,
    @Args() args: { id: ID; input: BlockInput }
  ) {
    return this.blockService.updateBlock(ctx, args.id, args.input);
  }

  @Mutation()
  @Transaction()
  async deletePost(@Ctx() ctx: RequestContext, @Args() args: { id: ID }) {
    return this.blockService.deleteBlock(ctx, args.id);
  }

  @Query()
  async getBlocks(@Ctx() ctx: RequestContext, @Args() args: GetBlocksArgs) {
    return this.blockService.getBlocks(ctx, args);
  }

  @Query()
  async getBlockById(@Ctx() ctx: RequestContext, @Args() args: { id: string }) {
    return this.blockService.getById(ctx, args.id);
  }

  @Query()
  async getBlockByIdWithChildren(@Ctx() ctx: RequestContext, @Args() args: { id: string }) {
    return this.blockService.getByIdWithChildren(ctx, args.id);
  }
}
