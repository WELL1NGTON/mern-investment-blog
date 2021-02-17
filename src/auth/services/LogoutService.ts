import LoginCommand from "@auth/commands/LoginCommand";
import AppError from "@shared/errors/AppError";
import Password from "@shared/richObjects/Password";
import Service from "@shared/services/Service";
import IUserRepository from "@users/models/IUserRepository";
import { StatusCodes } from "http-status-codes";
import bcrypt from "bcrypt";
import { injectable, inject } from "tsyringe";
import JWTUtils from "@auth/utils/JWTUtils";
import AuthData from "@auth/models/AuthData";
import {
  accessTokenOptions,
  refreshTokenOptions,
} from "@auth/configurations/jwtTokenOptions";
import IRefreshTokenRepository from "@auth/models/IRefreshTokenRepository";
import RefreshToken from "@auth/models/RefreshToken";

interface IRequest {
  accessToken: string;
}

@injectable()
class LogoutService extends Service {
  constructor(
    @inject("RefreshTokenRepository")
    private refreshTokenRepository: IRefreshTokenRepository
  ) {
    super();
  }

  // TODO: Falhando ao deslogar ?????????? WHY??????
  public async execute({ accessToken }: IRequest) {
    try {
      const authData = await JWTUtils.decodeToken(
        accessToken,
        accessTokenOptions
      );

      if (!authData)
        throw new AppError(
          "Falha na tentativa de logout",
          StatusCodes.INTERNAL_SERVER_ERROR
        );

      return await this.refreshTokenRepository.deleteAllByEmail((authData as AuthData).email);
    } catch {
      throw new AppError(
        "Falha na tentativa de logout",
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }
}

export default LogoutService;
