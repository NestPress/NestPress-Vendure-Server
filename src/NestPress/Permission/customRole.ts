import { Role, Permission } from "@vendure/core";
import { CUSTOM_PERMISSION } from "./customPermission";

export * from "./entity";

const permissions = Object.keys(Permission) as Permission[];

/* Sanit permissions */
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

const subscriberPermissions = [
  ...commonPermissions,
  CUSTOM_PERMISSION.CREATE_COMMENTS.Permission,
];

const creatorPermissions = [
  ...subscriberPermissions,
  CUSTOM_PERMISSION.MANAGE_OUR_COMMENTS.Permission,
  CUSTOM_PERMISSION.CREATE_CONTENT.Permission,
  CUSTOM_PERMISSION.MANAGE_OUR_CONTENT.Permission,
];

const operatorPermissions = [
  ...creatorPermissions,
  CUSTOM_PERMISSION.MANAGE_ALL_CONTENT.Permission,
  CUSTOM_PERMISSION.MANAGE_ALL_COMMENTS.Permission,
  /* add extra admin permission here */
];

export type CustomRoles = "OPERATOR" | "CREATOR" | "SUBSCRIBER";

export const CUSTOM_ROLES: Record<
  CustomRoles,
  Pick<Role, "code" | "description" | "channels" | "permissions">
> = {
  OPERATOR: {
    code: "__admin_user__",
    description: "user operator",
    channels: [{ id: 1 }] as Role["channels"],
    permissions: operatorPermissions,
  },
  CREATOR: {
    code: "__creator_user__",
    description: "user creator",
    channels: [{ id: 1 }] as Role["channels"],
    permissions: creatorPermissions,
  },
  SUBSCRIBER: {
    code: "__subscriber_user__",
    description: "user subscriber",
    channels: [{ id: 1 }] as Role["channels"],
    permissions: subscriberPermissions,
  },
};
