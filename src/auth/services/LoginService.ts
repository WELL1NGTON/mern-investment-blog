import LoginCommand from "@auth/commands/LoginCommand";
import { accessTokenOptions } from "@auth/configurations/jwtTokenOptions";
import AuthData from "@auth/models/AuthData";
import IRefreshTokenRepository from "@auth/models/IRefreshTokenRepository";
import RefreshToken from "@auth/models/RefreshToken";
import JWTUtils from "@auth/utils/JWTUtils";
import TYPES from "@shared/constants/TYPES";
import AppError from "@shared/errors/AppError";
import Password from "@shared/valueObjects/Password";
import IUserRepository from "@users/models/IUserRepository";
import bcrypt from "bcrypt";
import { StatusCodes } from "http-status-codes";
import { inject, Container, injectable } from "inversify";

export interface ILoginService {
  execute(
    command: LoginCommand
  ): Promise<{
    accessToken: string;
    refreshToken: string;
  }>;
}

@injectable()
class LoginService implements ILoginService {
  constructor(
    @inject(TYPES.IUserRepository)
    private userRepository: IUserRepository,
    @inject(TYPES.IRefreshTokenRepository)
    private refreshTokenRepository: IRefreshTokenRepository
  ) {}

  public async execute(
    command: LoginCommand
  ): Promise<{
    accessToken: string;
    refreshToken: string;
  }> {
    const user = await this.userRepository.getByEmail(command.email);

    if (!user) throw new AppError("Email ou senha incorretos");

    const authData = new AuthData();
    authData.email = user.email.value;
    authData.role = user.role;

    const isMatch = await Password.isMatch(command.password, user.password);

    if (!isMatch)
      throw new AppError("Email ou senha inválidos", StatusCodes.BAD_REQUEST);

    const accessToken = JWTUtils.generateToken(
      authData.toJSON(),
      accessTokenOptions
    );
    const salt = await bcrypt.genSalt(10);
    const refreshToken: string = await bcrypt.hash(authData.email, salt);

    if (!accessToken || !refreshToken)
      throw new AppError(
        "Falha ao autenticar o usuário",
        StatusCodes.INTERNAL_SERVER_ERROR
      );

    const currentDate = new Date(Date.now());

    const datePluOneMonth = new Date(
      currentDate.setMonth(currentDate.getMonth() + 1)
    );

    const refresh = new RefreshToken(
      command.email,
      refreshToken,
      datePluOneMonth
    );

    // Delete all active refreshTokens
    await this.refreshTokenRepository.deleteAllByEmail(command.email);

    // Create new refreshToken
    await this.refreshTokenRepository.create(refresh);

    return { accessToken, refreshToken };
  }
}

export default LoginService;
