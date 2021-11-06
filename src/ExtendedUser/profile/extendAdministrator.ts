import { Parent, ResolveField, Resolver } from "@nestjs/graphql";
import { Ctx, RequestContext, Administrator } from "@vendure/core";
import { ProfileService } from "./profileService";

@Resolver("Administrator")
export class AdministratorProfileResolver {
  constructor(private profileService: ProfileService) {}

  @ResolveField()
  profile(@Ctx() ctx: RequestContext, @Parent() { id }: Administrator) {
    return this.profileService.getProfileById(ctx, id);
  }
}
