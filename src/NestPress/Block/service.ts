import { Injectable } from "@nestjs/common";
import { ID, RequestContext, TransactionalConnection } from "@vendure/core";
import { GetBlocksArgs, BlocksFilter, BlockInput, BlocksInput } from "./resolver";
import { Block } from "./entity";
import { createAdvancedQuery, AdvancedQueryResult } from "../advancedQuery";

@Injectable()
export class BlockService {
  private queryCollection: AdvancedQueryResult<Block, any>;
  
  constructor(private connection: TransactionalConnection) {
    this.queryCollection = createAdvancedQuery({
      connection,
      entity: Block,
      relations: [],
      fullTextSearch: {}
    });
  }

  getById(ctx: RequestContext, id: string) {
    const qb = this.queryCollection(ctx, {
      filter: {
        id: {
          eq: id
        }
      }
    });

    return qb.getQuery().getOne();
  }

  async getByIdWithChildren(ctx: RequestContext, id: string) {
    const qb = this.queryCollection(ctx, {
      filter: {
        id: {
          eq: id
        }
      }
    });

    const one = await qb.getQuery().getOne();

    const qb2 = this.queryCollection(ctx, {
        filter: {
            parentId: {
                eq: id
            }
        }
    });

    const children = await qb2.getListWithCount();

    return {
        ...one,
        children: children.list
    }
  }

  getBlocks(ctx: RequestContext, args: GetBlocksArgs = {
    sort: {
      order: 'ASC'
    }
  }) {
    const qb = this.queryCollection(ctx, args);

    return qb.getListWithCount(qb.getQuery());
  }

  async deleteBlock(ctx: RequestContext, id: string) {
    const repository = this.connection.getRepository(ctx, Block);

    await repository.delete(id);
    
    return id;
  }

  async deleteBlocks(ctx: RequestContext, input: { blocks: string[]; }) {
    let result = [];

    for (let i = 0; i < input.blocks.length; i++) {
      result.push(await this.deleteBlock(ctx, input.blocks[i]));
    }

    return result;
  }

  async updateBlock(ctx: RequestContext, id: ID, input: BlockInput) {
    const repository = this.connection.getRepository(ctx, Block);

    await repository.update(id, {
      ...input
    });

    const post = await repository.findOneOrFail(id);

    return post;
  }
  async updateBlocks(ctx: RequestContext, input: BlocksInput) {
    let result = [];

    for (let i = 0; i < input.blocks.length; i++) {
      result.push(await this.updateBlock(ctx, input.blocks[i].id!, input.blocks[i]));
    }

    return result;
  }
  async createBlock(ctx: RequestContext, input: BlockInput) {
    const repository = this.connection.getRepository(ctx, Block);

    const post = repository.create({
      ...input,
    });
    return await repository.save(post);
  }

  async createBlocks(ctx: RequestContext, input: BlocksInput) {
    let result = [];

    for (let i = 0; i < input.blocks.length; i++) {
      result.push(await this.createBlock(ctx, input.blocks[i]));
    }

    return result;
  }
}
