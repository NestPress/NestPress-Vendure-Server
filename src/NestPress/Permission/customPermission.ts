import { PermissionDefinition } from "@vendure/core";

const CREATE_CONTENT = new PermissionDefinition({
  name: "CREATE_CONTENT",
  description: "User can create content",
});

export const CUSTOM_PERMISSION = {
  CREATE_CONTENT,
};

export const CUSTOM_PERMISSION_ARR = Object.values(CUSTOM_PERMISSION);
