import { Query, Resolver, Mutation, Args } from "@nestjs/graphql";

import { Ctx, RequestContext, Allow, Transaction, Administrator } from "@vendure/core";

import { CreateAdministratorWithProfileInput } from "./entity";
import { ProfileService } from "./profileService";
import { CUSTOM_PERMISSION } from "./customPermission";
import { ListWithItems } from "../advancedQuery";

type RegisterAdminWithProfile = {
  input: CreateAdministratorWithProfileInput;
};

@Resolver()
export class ProfileResolver {
  constructor(private profileService: ProfileService) {}

  @Query()
  async getProfiles(@Ctx() ctx: RequestContext) {
    return this.profileService.getProfiles(ctx);
  }

  @Query()
  async getProfileById(
    @Ctx() ctx: RequestContext,
    @Args() args: { id: string }
  ) {
    return this.profileService.getProfileById(ctx, args.id);
  }

  // Permission guard
  // @Allow(CUSTOM_PERMISSION.CREATE_CONTENT.Permission)
  @Transaction()
  @Mutation()
  async registerAdministratorWithProfile(
    @Ctx() ctx: RequestContext,
    @Args() args: RegisterAdminWithProfile
  ) {
     return this.profileService.registerByPassword(ctx, args.input, "CREATOR");
  }
}
