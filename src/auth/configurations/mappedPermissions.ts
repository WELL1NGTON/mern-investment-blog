import Permission, { permissions } from "@shared/types/Permission";

import Role from "@shared/types/Role";

const mappedPermissions: Map<Role, Set<Permission>> = new Map()
  .set("USER", new Set())
  .set("ADMIN", new Set(permissions))
  .set("WRITER", new Set(["createArticle", "deleteArticle", "editArticle"]));

export default mappedPermissions;
