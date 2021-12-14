import { Injectable } from "@nestjs/common";
import {
  Customer,
  RequestContext,
  TransactionalConnection,
  User,
} from "@vendure/core";
import { Repository } from "typeorm";
import { AdvancedQueryResult, createAdvancedQuery } from "../advancedQuery";
import { Block } from "../Block/entity";
import { GetCustomersArgs } from "./entity";

@Injectable()
export class NestPressCustomerService {
  private queryCollection: AdvancedQueryResult<Customer, any>;

  constructor(private connection: TransactionalConnection) {
    this.queryCollection = createAdvancedQuery({
      connection,
      entity: Customer,
      relations: [],
      fullTextSearch: {},
    });
  }

  getCustomerById(ctx: RequestContext, id: string) {
    const qb = this.queryCollection(ctx, {
      filter: {
        id: {
          eq: id,
        },
      },
    });

    return qb.getQuery().getOne();
  }

  getCustomer(
    ctx: RequestContext,
    args: GetCustomersArgs = {
      sort: {
        order: "ASC",
      },
    }
  ) {
    const qb = this.queryCollection(ctx, args);

    return qb.getListWithCount(qb.getQuery());
  }
}
