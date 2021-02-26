import { NextFunction, Request, Response } from "express";
import Permission, { permissions } from "@shared/types/Permission";

import { BaseMiddleware } from "inversify-express-utils";
import Role from "@shared/types/Role";
import { injectable } from "inversify";

@injectable()
class HasPermission extends BaseMiddleware {
  public handler(
    request: Request,
    response: Response,
    next: NextFunction
  ): void {
    return;
  }
}
