import { DeepPartial, ID } from "@vendure/common/lib/shared-types";
import { Column, Entity, ManyToOne } from "typeorm";

import { OrderableAsset } from "@vendure/core/dist/entity/asset/orderable-asset.entity";

import { Profile } from "./entity";

@Entity()
export class ProfileAsset extends OrderableAsset {
  constructor(input?: DeepPartial<ProfileAsset>) {
    super(input);
  }
  @Column()
  profileId!: ID;

  @ManyToOne(() => Profile, (p) => p.assets, {
    onDelete: "CASCADE",
  })
  profile!: Profile;
}
