import { Injectable } from "@nestjs/common";
import { ID, RequestContext, TransactionalConnection } from "@vendure/core";
import { GetBlocksArgs, BlocksFilter, BlockInput } from "./resolver";
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

  getBlocks(ctx: RequestContext, args: GetBlocksArgs = {}) {
    const qb = this.queryCollection(ctx, args);

    return qb.getListWithCount(qb.getQuery());
  }

  async deleteBlock(ctx: RequestContext, id: string) {
    const repository = this.connection.getRepository(ctx, Block);

    repository.softDelete(id);

    return id;
  }
  async updateBlock(ctx: RequestContext, id: ID, input: BlockInput) {
    const repository = this.connection.getRepository(ctx, Block);

    await repository.update(id, {
      ...input
    });

    const post = await repository.findOneOrFail(id);

    return post;
  }
  async createBlock(ctx: RequestContext, input: BlockInput) {
    const repository = this.connection.getRepository(ctx, Block);

    const post = repository.create({
      ...input,
    });
    return await repository.save(post);
  }
}
