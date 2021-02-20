import { NextFunction, Request, Response } from "express";

import AppError from "@shared/errors/AppError";
import AuthData from "@auth/models/AuthData";
import Permission from "@shared/types/Permission";
import Role from "@shared/types/Role";
import { StatusCodes } from "http-status-codes";
import mappedPermissions from "@auth/configurations/mappedPermissions";

function hasPermission(permission: Permission) {
  return function (
    request: Request,
    response: Response,
    next: NextFunction
  ): AppError {
    const authData: AuthData = request.body.auth;

    if (
      mappedPermissions.has(authData.role as Role) &&
      mappedPermissions.get(authData.role as Role)?.has(permission)
    )
      next();

    return new AppError(
      "Você não tem permissão para fazer isso",
      StatusCodes.UNAUTHORIZED
    );
  };
}

export default hasPermission;
