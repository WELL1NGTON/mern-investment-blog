import { accessTokenOptions } from "@auth/configurations/jwtTokenOptions";
import AuthData from "@auth/models/AuthData";
import IRefreshTokenRepository from "@auth/models/IRefreshTokenRepository";
import JWTUtils from "@auth/utils/JWTUtils";
import TYPES from "@shared/constants/TYPES";
import AppError from "@shared/errors/AppError";
import Service from "@shared/services/Service";
import { StatusCodes } from "http-status-codes";
import { inject, Container, injectable } from "inversify";

interface IRequest {
  accessToken: string;
}

@injectable()
class LogoutService {
  constructor(
    @inject(TYPES.IRefreshTokenRepository)
    private refreshTokenRepository: IRefreshTokenRepository
  ) {}

  // TODO: Falhando ao deslogar ?????????? WHY??????
  public async execute({ accessToken }: IRequest): Promise<null> {
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

      return await this.refreshTokenRepository.deleteAllByEmail(
        (authData as AuthData).email
      );
    } catch {
      throw new AppError(
        "Falha na tentativa de logout",
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }
}

export default LogoutService;
