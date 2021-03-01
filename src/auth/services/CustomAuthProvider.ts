import { NextFunction, Request, Response } from "express";
import { inject, injectable } from "inversify";

import CustomPrincipal from "./CustomPrincipal";
import { interfaces } from "inversify-express-utils";

const authService = inject("AuthService");

@injectable()
class CustomAuthProvider implements interfaces.AuthProvider {
  @authService private readonly _authService: AuthService;

  public async getUser(
    request: Request,
    response: Response,
    next: NextFunction
  ): Promise<interfaces.Principal> {
    const token = request.headers["x-auth-token"];
    const user = await this._authService.getUser(token);
    const principal = new CustomPrincipal(user);
    return principal;
  }
}

export default CustomAuthProvider;
