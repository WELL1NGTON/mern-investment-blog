import { NextFunction, Request, Response } from "express";
import { inject, injectable } from "inversify";

import AuthService from "./AuthService";
import CustomPrincipal from "./CustomPrincipal";
import TYPES from "@shared/constants/TYPES";
import { interfaces } from "inversify-express-utils";

const authService = inject(TYPES.AuthService);

@injectable()
class CustomAuthProvider implements interfaces.AuthProvider {
  @authService private readonly _authService: AuthService;

  public async getUser(
    request: Request,
    response: Response,
    next: NextFunction
  ): Promise<interfaces.Principal> {
    const bearer = request.headers["authorization"];

    const authInfo = await this._authService.getAuthInfoFromHeaderAuthorization(
      bearer
    );
    const principal = new CustomPrincipal(authInfo);
    return principal;
  }
}

export default CustomAuthProvider;
