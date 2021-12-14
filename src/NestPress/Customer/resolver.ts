import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { Ctx, ID, RequestContext, Transaction } from "@vendure/core";
import { GetListArgs, ListFiltersOperators } from "../common";
import { GetCustomersArgs } from "./entity";
import { NestPressCustomerService } from "./service";

@Resolver("Customer")
export class CustomerResolver {
  constructor(private customersService: NestPressCustomerService) {}

  @Query()
  async getCustomers(@Ctx() ctx: RequestContext, @Args() args: GetCustomersArgs) {
    return this.customersService.getCustomer(ctx, args);
  }

  @Query()
  async getCustomerById(@Ctx() ctx: RequestContext, @Args() args: { id: string }) {
    return this.customersService.getCustomerById(ctx, args.id);
  }
}
