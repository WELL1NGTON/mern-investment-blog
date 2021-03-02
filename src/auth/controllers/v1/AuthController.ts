import LoginCommand from "@auth/commands/LoginCommand";
import RefreshTokenCommand from "@auth/commands/RefreshTokenCommand";
import AuthService from "@auth/services/AuthService";
import LoginService from "@auth/services/LoginService";
import LogoutService from "@auth/services/LogoutService";
import RefreshTokenService from "@auth/services/RefreshTokenService";
import TYPES from "@shared/constants/TYPES";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { inject } from "inversify";
import {
  BaseHttpController,
  controller,
  httpGet,
  httpPost,
} from "inversify-express-utils";
import { ApiOperationGet, ApiOperationPost, ApiPath } from "swagger-express-ts";

const authService = inject(TYPES.AuthService);

@ApiPath({
  path: "/api/v1/auth",
  name: "Auth",
})
@controller("/api/v1/auth")
class AuthController extends BaseHttpController {
  @authService private readonly _authService: AuthService;

  constructor(
    @inject(TYPES.LoginService)
    private loginService: LoginService,
    @inject(TYPES.LogoutService)
    private logoutService: LogoutService,
    @inject(TYPES.RefreshTokenService)
    private refreshTokenService: RefreshTokenService
  ) {
    super();
  }

  @ApiOperationGet({
    summary: "Authenticate the user",
    description: "Authenticate the user",
    path: "/",
    parameters: {},
    responses: {
      [StatusCodes.OK]: {
        description: "Success",
        model: "AuthDetails",
      },
      [StatusCodes.UNAUTHORIZED]: {
        description: "Unauthorized",
        model: "AppError",
      },
    },
    security: { ["Bearer"]: [] },
  })
  @httpGet("/")
  public async checkAuth(
    request: Request,
    response: Response
  ): Promise<Response> {
    await this._authService.ensureAuthenticated(this.httpContext);

    return response.status(StatusCodes.OK).json(this.httpContext.user.details);
  }

  @ApiOperationPost({
    summary: "Authenticate the user",
    description: "Authenticate the user",
    path: "/login",
    parameters: {
      body: {
        description: "Login",
        required: true,
        model: "Login",
      },
    },
    responses: {
      [StatusCodes.OK]: {
        description: "Success",
        model: "LoginSuccess",
      },
    },
  })
  @httpPost("/login", LoginCommand.validator)
  public async login(request: Request, response: Response): Promise<Response> {
    const command = LoginCommand.requestToCommand(request);

    const auth = await this.loginService.execute(command);

    return response.status(StatusCodes.OK).json(auth);
  }

  @ApiOperationPost({
    summary: "Deauthenticate the user",
    description: "Deauthenticate the user",
    path: "/logout",
    parameters: {},
    responses: {
      [StatusCodes.OK]: {
        description: "Success",
      },
      [StatusCodes.UNAUTHORIZED]: {
        description: "Unauthorized",
        model: "AppError",
      },
    },
    security: { ["Bearer"]: [] },
  })
  @httpPost("/logout")
  public async logout(request: Request, response: Response): Promise<Response> {
    await this._authService.ensureAuthenticated(this.httpContext);

    await this.logoutService.execute({
      email: this._authService.authInfo(this.httpContext).email ?? "",
    });

    return response.status(StatusCodes.OK).json();
  }

  @ApiOperationPost({
    summary: "Reauthenticate the user",
    description: "Reauthenticate the user",
    path: "/refresh",
    parameters: {
      body: {
        description: "RefreshToken",
        required: true,
        model: "RefreshToken",
      },
    },
    responses: {
      [StatusCodes.OK]: {
        description: "Success",
        model: "LoginSuccess",
      },
    },
  })
  @httpPost("/refresh", RefreshTokenCommand.validator)
  public async refresh(
    request: Request,
    response: Response
  ): Promise<Response> {
    const command = RefreshTokenCommand.requestToCommand(request);

    const auth = await this.refreshTokenService.execute(command);

    return response.status(StatusCodes.OK).json(auth);
  }
}

export default AuthController;
