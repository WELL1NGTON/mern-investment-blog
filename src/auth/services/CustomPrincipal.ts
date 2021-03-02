import Role, { roleHasPermission } from "@shared/types/Role";

import { IAuthInfo } from "./AuthService";
import Permission from "@shared/types/Permission";
import { interfaces } from "inversify-express-utils";
import mongoose from "mongoose";

class CustomPrincipal implements interfaces.Principal {
  details: IAuthInfo;

  constructor(authInfo: IAuthInfo) {
    this.details = authInfo;
  }

  public isAuthenticated(): Promise<boolean> {
    return Promise.resolve(
      this.details.isTokenValid &&
        typeof this.details.isTokenExpired !== "undefined" &&
        this.details.isTokenExpired === false
    );
  }

  public isResourceOwner(
    resourceOwnerId: string | mongoose.Types.ObjectId
  ): Promise<boolean> {
    if (!this.details.userId) return Promise.resolve(false);
    if (typeof resourceOwnerId === "string")
      return Promise.resolve(resourceOwnerId === this.details.userId);
    return Promise.resolve(
      resourceOwnerId.toHexString() === this.details.userId
    );
  }

  public isInRole(role: Role): Promise<boolean> {
    if (!this.details.role) return Promise.resolve(false);
    return Promise.resolve(role === this.details.role);
  }

  public hasPermission(permission: Permission): Promise<boolean> {
    if (!this.details.role) return Promise.resolve(false);
    return Promise.resolve(roleHasPermission(this.details.role, permission));
  }
}

export default CustomPrincipal;

// export { ICustomPrincipal };
