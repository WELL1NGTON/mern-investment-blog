import Permission, { permissions } from "./Permission";

const roles = ["ADMIN", "WRITER", "USER"] as const;

const rolesPermission: Record<Role, Permission[]> = {
  ADMIN: [...permissions],
  USER: ["VIEW_ARTICLE_VISIBILITY_ALL", "VIEW_CATEGORY_VISIBILITY_ALL"],
  WRITER: [
    "VIEW_ARTICLE_VISIBILITY_ALL",
    "VIEW_ARTICLE_VISIBILITY_EDITORS",
    "VIEW_ARTICLE_VISIBILITY_USERS",
    "CREATE_ARTICLE",
    "EDIT_ARTICLE",
    "DELETE_ARTICLE",
    "VIEW_CATEGORY_VISIBILITY_ALL",
    "VIEW_CATEGORY_VISIBILITY_EDITORS",
    "VIEW_CATEGORY_VISIBILITY_USERS",
    "CREATE_CATEGORY",
    "EDIT_CATEGORY",
    "DELETE_CATEGORY",
  ],
};

type Role = typeof roles[number];

const matchRoles = (role: string): boolean => {
  return roles.includes(role as Role);
};

const roleHasPermission = function (
  role: Role,
  permission: Permission
): boolean {
  return rolesPermission[role].includes(permission);
};

const getPermissionsFromRole = (role: Role): Permission[] => {
  return rolesPermission[role];
};

const defaultRole: Role = "USER";

export default Role;

export {
  roles,
  matchRoles,
  defaultRole,
  roleHasPermission,
  getPermissionsFromRole,
};
