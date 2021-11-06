import { Role, Permission } from "@vendure/core";
import { CUSTOM_PERMISSION } from "./customPermission";

export * from "./entity";

const permissions = Object.keys(Permission) as Permission[];

const permissionsToOmit = [
  Permission.SuperAdmin,
  Permission.CreateAdministrator,
  Permission.ReadAdministrator,
  Permission.UpdateAdministrator,
  Permission.DeleteAdministrator,
];

const commonPermissions = permissions.filter(
  (p) => !permissionsToOmit.includes(p)
);

const creatorPermissions = [
  ...commonPermissions,
  CUSTOM_PERMISSION.CREATE_CONTENT.Permission,
];

const adminPermissions = [
  ...creatorPermissions,
  /* add extra admin permission here */
];

export type CustomRoles = "ADMIN" |"CREATOR";

export const CUSTOM_ROLES: Record<
  CustomRoles,
  Pick<Role, "code" | "description" | "channels" | "permissions">
> = {
  ADMIN: {
    code: "__admin_user__",
    description: "user admin",
    channels: [{ id: 1 }] as Role["channels"],
    permissions: adminPermissions,
  },
  CREATOR: {
    code: "__creator_user__",
    description: "user creator",
    channels: [{ id: 1 }] as Role["channels"],
    permissions: creatorPermissions,
  },
};
