import { Request, Response } from "express";
import {
  accessTokenOptions,
  refreshTokenOptions,
} from "@auth/configurations/jwtTokenOptions";

import AppError from "@shared/errors/AppError";
import LoginCommand from "@auth/commands/LoginCommand";
import LoginService from "@auth/services/LoginService";
import LogoutService from "@auth/services/LogoutService";
import { StatusCodes } from "http-status-codes";
import { container } from "tsyringe";

class AuthController {
  public async login(request: Request, response: Response): Promise<Response> {
    const command = LoginCommand.requestToCommand(request);

    const auth = await container.resolve(LoginService).execute(command);

    return response
      .cookie(accessTokenOptions.property, auth.accessToken, { httpOnly: true })
      .cookie(refreshTokenOptions.property, auth.refreshToken, {
        httpOnly: true,
      })
      .status(StatusCodes.OK)
      .json(auth);
  }

  public async logout(request: Request, response: Response): Promise<Response> {
    const accessToken = request.cookies[accessTokenOptions.property];

    if (!accessToken)
      throw new AppError("Logout Error", StatusCodes.INTERNAL_SERVER_ERROR);

    await container
      .resolve(LogoutService)
      .execute({ accessToken: accessToken as string });

    return response
      .clearCookie(accessTokenOptions.property)
      .clearCookie(refreshTokenOptions.property)
      .status(StatusCodes.OK)
      .json();
  }
}

export default AuthController;
