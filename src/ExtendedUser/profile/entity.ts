import { 
  VendureEntity, 
  Administrator, 
  /* # Assets - void extention  */
  // Asset,
  // EntityWithAssets,
  ID,
  // Address 
} from "@vendure/core";
import { Column, Entity, OneToOne, JoinColumn, ManyToOne, ManyToMany, OneToMany } from "typeorm";
import { DeepPartial } from "@vendure/common/lib/shared-types";
/* # Assets - void extention  */
// import { ProfileAsset } from "./profileAsset.entity";

export type CreateAdministratorWithProfileInput = {
  firstName: string;
  lastName: string;
  emailAddress: string;
  password: string;
  /* # Languages - void extention  */
  // languages: string[];
};

export type ExtendedAdministrator = Administrator & {
  profile: Profile;
};

@Entity()
/* # Assets - void extention  */
/* export class Profile extends VendureEntity implements EntityWithAssets{ */
export class Profile extends VendureEntity {
  constructor(input?: DeepPartial<Profile>) {
    super(input);
  }

  @Column({ default: false })
  blocked?: boolean;

  /* # Languages - void extention  */
  // @Column("text", { array: true , nullable: true })
  // languages!: string[];

  /* # Assets - void extention  */
  // @ManyToOne(() => Asset, { onDelete: "SET NULL" })
  // featuredAsset!: Asset;
  // @OneToMany(() => ProfileAsset, (a) => a.profile, { onDelete: "CASCADE" })
  // assets!: ProfileAsset[];

  @OneToOne(() => Administrator, { nullable: false, eager: true })
  @JoinColumn()
  user!: Administrator;
}
