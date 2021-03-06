import LoginCommand from "@auth/commands/LoginCommand";
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
import { v4 as uuidv4 } from "uuid";

import AuthService from "./AuthService";

const authService = inject(TYPES.AuthService);

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
    command: LoginCommand
  ): Promise<{
    accessToken: string;
    refreshToken: string;
    user: User;
  }> {
    const user = await this.userRepository.getByEmail(command.email);

    if (!user) throw new AppError("Email ou senha inválidos");

    const authData = new AuthData();
    authData.email = user.email.value;
    authData.role = user.role;

    const isMatch = await Password.isMatch(command.password, user.password);

    if (!isMatch)
      throw new AppError("Email ou senha inválidos", StatusCodes.BAD_REQUEST);

    const profile = await this.profileRepository.getById(user.id);

    if (!profile) throw new AppError("Email ou senha inválidos");

    const accessToken = await this._authService.generateToken(user, profile);

    const refreshToken: string = uuidv4();

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

    return { accessToken, refreshToken, user };
  }
}

export default LoginService;
