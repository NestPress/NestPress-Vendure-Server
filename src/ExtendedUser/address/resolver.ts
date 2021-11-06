import { Query, Resolver, Mutation, Args } from "@nestjs/graphql";

import { Ctx, RequestContext, Allow, Transaction, Administrator } from "@vendure/core";

import { ListWithItems } from "../advancedQuery";
import { AddressService, CreateAddressPayloadDto } from "./service";

type CreateAddress = {
  input: CreateAddressPayloadDto;
};

@Resolver()
export class AddressResolver {
  constructor(private addressService: AddressService) {}

  @Query()
  async getPhysicalAddresses(@Ctx() ctx: RequestContext) {
    return this.addressService.getAll(ctx);
  }

  // @Allow(CUSTOM_PERMISSION.CREATE_CONTENT.Permission)
  @Mutation()
  async createPhysicalAddress(
    @Ctx() ctx: RequestContext,
    @Args() args: CreateAddress
  ) {
    return this.addressService.createAddress(ctx, args.input);
  }
}
