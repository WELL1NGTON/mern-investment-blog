import { ObjectId } from "mongoose";
import Permission from "@shared/types/Permission";
import Role from "@shared/types/Role";
import { interfaces } from "inversify-express-utils";

interface ICustomPrincipal extends interfaces.Principal {
  hasPermission(permission: Permission): Promise<boolean>;
}

class CustomPrincipal implements ICustomPrincipal {
  details: any;

  constructor(details: any) {
    this.details = details;
  }

  hasPermission(permission: Permission): Promise<boolean> {
    throw new Error("Method not implemented.");
  }
  isAuthenticated(): Promise<boolean> {
    throw new Error("Method not implemented.");
  }
  isResourceOwner(resourceId: string | ObjectId): Promise<boolean> {
    throw new Error("Method not implemented.");
  }
  isInRole(role: Role): Promise<boolean> {
    throw new Error("Method not implemented.");
  }
}

export default CustomPrincipal;

export { ICustomPrincipal };
