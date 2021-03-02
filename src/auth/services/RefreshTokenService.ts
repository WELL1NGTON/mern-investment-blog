import LoginCommand from "@auth/commands/LoginCommand";
import RefreshTokenCommand from "@auth/commands/RefreshTokenCommand";
import AuthData from "@auth/models/AuthData";
import IRefreshTokenRepository from "@auth/models/IRefreshTokenRepository";
import RefreshToken from "@auth/models/RefreshToken";
import TYPES from "@shared/constants/TYPES";
import AppError from "@shared/errors/AppError";
import Password from "@shared/valueObjects/Password";
import IProfileRepository from "@users/models/IProfileRepository";
import IUserRepository from "@users/models/IUserRepository";
import User from "@users/models/User";
import { StatusCodes } from "http-status-codes";
import { inject, injectable } from "inversify";
import { token } from "morgan";
import { v4 as uuidv4 } from "uuid";

import AuthService from "./AuthService";

const authService = inject(TYPES.AuthService);

@injectable()
class RefreshTokenService {
  @authService private readonly _authService: AuthService;

  constructor(
    @inject(TYPES.IUserRepository)
    private userRepository: IUserRepository,
    @inject(TYPES.IProfileRepository)
    private profileRepository: IProfileRepository,
    @inject(TYPES.IRefreshTokenRepository)
    private refreshTokenRepository: IRefreshTokenRepository
  ) {}

  public async execute(
    command: RefreshTokenCommand
  ): Promise<{
    accessToken: string;
    refreshToken: string;
    user: User;
  }> {
    const refreshTokenFound = await this.refreshTokenRepository.findRefreshToken(
      command.refreshToken
    );

    if (refreshTokenFound === null)
      throw new AppError("Refresh Token inválido", StatusCodes.BAD_REQUEST);

    const currentDate = new Date(Date.now());

    if (refreshTokenFound.expirationDate.getTime() < currentDate.getTime()) {
      await this.refreshTokenRepository.deleteAllByEmail(
        refreshTokenFound.email.value
      );
      throw new AppError("Refresh Token expirado", StatusCodes.BAD_REQUEST);
    }

    const user = await this.userRepository.getByEmail(
      refreshTokenFound.email.value
    );

    if (!user) {
      await this.refreshTokenRepository.deleteAllByEmail(
        refreshTokenFound.email.value
      );
      throw new AppError("Refresh Token inválido", StatusCodes.BAD_REQUEST);
    }

    const profile = await this.profileRepository.getById(user.id);

    if (!profile) {
      await this.refreshTokenRepository.deleteAllByEmail(
        refreshTokenFound.email.value
      );
      throw new AppError("Refresh Token inválido", StatusCodes.BAD_REQUEST);
    }

    const authData = new AuthData();
    authData.email = user.email.value;
    authData.role = user.role;

    const accessToken = await this._authService.generateToken(user, profile);

    const refreshToken: string = uuidv4();

    if (!accessToken || !refreshToken)
      throw new AppError(
        "Falha ao autenticar o usuário",
        StatusCodes.INTERNAL_SERVER_ERROR
      );

    const datePluOneMonth = new Date(
      currentDate.setMonth(currentDate.getMonth() + 1)
    );

    const refresh = new RefreshToken(
      user.email.value,
      refreshToken,
      datePluOneMonth
    );

    // Delete all active refreshTokens
    await this.refreshTokenRepository.deleteAllByEmail(user.email.value);

    // Create new refreshToken
    await this.refreshTokenRepository.create(refresh);

    return { accessToken, refreshToken, user };
  }
}

export default RefreshTokenService;
