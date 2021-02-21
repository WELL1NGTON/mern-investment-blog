import LoginCommand from "@auth/commands/LoginCommand";
import {
  accessTokenOptions,
  refreshTokenOptions,
} from "@auth/configurations/jwtTokenOptions";
import EnsureAuthenticated from "@auth/middleware/EnsureAuthenticated";
import { ILoginService } from "@auth/services/LoginService";
import { ILogoutService } from "@auth/services/LogoutService";
import TYPES from "@shared/constants/TYPES";
import AppError from "@shared/errors/AppError";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { inject } from "inversify";
import {
  BaseHttpController,
  controller,
  httpPost,
} from "inversify-express-utils";

// import { container } from "tsyringe";

@controller("/api/v1/auth")
class AuthController extends BaseHttpController {
  constructor(
    @inject(TYPES.LoginService)
    private loginService: ILoginService,
    @inject(TYPES.LogoutService)
    private logoutService: ILogoutService
  ) {
    super();
  }

  @httpPost("/login", LoginCommand.validator)
  public async login(request: Request, response: Response): Promise<Response> {
    const command = LoginCommand.requestToCommand(request);

    const auth = await this.loginService.execute(command);

    return response
      .cookie(accessTokenOptions.property, auth.accessToken, { httpOnly: true })
      .cookie(refreshTokenOptions.property, auth.refreshToken, {
        httpOnly: true,
      })
      .status(StatusCodes.OK)
      .json(auth);
  }

  @httpPost("/logout", TYPES.EnsureAuthenticated)
  public async logout(request: Request, response: Response): Promise<Response> {
    const accessToken = request.cookies[accessTokenOptions.property];

    if (!accessToken)
      throw new AppError("Logout Error", StatusCodes.INTERNAL_SERVER_ERROR);

    await this.logoutService.execute({ accessToken: accessToken as string });

    return response
      .clearCookie(accessTokenOptions.property)
      .clearCookie(refreshTokenOptions.property)
      .status(StatusCodes.OK)
      .json();
  }
}

export default AuthController;
