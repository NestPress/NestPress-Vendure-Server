import { Injectable } from "@nestjs/common";

import {
  Role,
  AdministratorService,
  ID,
  RequestContext,
  TransactionalConnection,
  Administrator,
  /* # Assets - void extention  */
  // AssetService,
  // AssetServiceAsset,
} from "@vendure/core";

import { Profile, CreateAdministratorWithProfileInput, ExtendedAdministrator } from "./entity";
import { CUSTOM_ROLES } from "./customRole";

import { ListWithItems, listWithItems } from "../advancedQuery";

@Injectable()
export class ProfileService {
  constructor(
    private connection: TransactionalConnection,
    private administratorService: AdministratorService,
    /* # Assets - void extention  */
    // private assetService: AssetService,
  ) {}

  async beforeSave(ctx: RequestContext, p: Profile, input: any) {
    /* # Assets - void extention  */
    // await this.assetService.updateEntityAssets(ctx, p, input);
  }

  private async createProfile(
    ctx: RequestContext,
    userId: ID
  ): Promise<Profile | undefined> {
    const repository = this.connection.getRepository(ctx, Profile);

   
    const profile = repository.create({

      /* # Languages - void extention  */
      // languages: [],
      
      blocked: false,
      user: { id: userId },
    });

    await repository.save(profile);
    return profile;
  }

  async registerByPassword(
    ctx: RequestContext,
    args: CreateAdministratorWithProfileInput,
    _role: keyof typeof CUSTOM_ROLES
  ): Promise<ExtendedAdministrator | undefined> {
    const role = await this.connection
      .getRepository(ctx, Role)
      .findOne({ where: { code: CUSTOM_ROLES[_role].code } });

    if (!role) return;

    const newAdmin = await this.administratorService.create(ctx, {
      ...args,
      roleIds: [role.id],
    });

    const profile = await this.createProfile(ctx, newAdmin.id);
    return profile ? { ...newAdmin, profile } : undefined;
  }

  async getProfileById(ctx: RequestContext, id: ID) {
    return this.connection
      .getRepository(ctx, Profile)
      .findOne({ where: { user: id } });
  }

  async getProfiles(
    ctx: RequestContext
  ): Promise<ListWithItems<Administrator>> {
    const adminRepo = this.connection.getRepository(ctx, Administrator);
    return adminRepo.findAndCount().then(listWithItems);
  }

}
