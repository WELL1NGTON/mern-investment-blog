import User from "@shared/models/user.model";
import bcrypt from "bcrypt";
import RefreshToken from "@shared/models/refreshToken.model";
import {
  generateAccessToken,
  generateRefreshToken,
  IUserInfo,
} from "@shared/util/jwtTokens";
import AppError from "@shared/errors/AppError";

interface IRequest {
  email: string;
  password: string;
}

interface IResponse {
  userInfo: IUserInfo;
  accessToken: string;
  refreshToken: string;
}

class AuthenticateUserService {
  public async execute({ email, password }: IRequest): Promise<IResponse> {
    if (!email || !password)
      throw new AppError("Por favor, preencha todos os campos", 400);

    const user = await User.findOne({ email }).exec();

    if (!user) throw new AppError("Usuário não existe.", 400);

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) throw new AppError("Email ou senha inválidos", 400);

    const userInfo: IUserInfo = {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    };

    const accessToken = generateAccessToken(userInfo);
    const refreshToken = generateRefreshToken(userInfo);

    if (!accessToken || !refreshToken)
      throw new AppError("Falha ao autenticar o usuário.", 500);

    const newRefreshToken = new RefreshToken({
      user_id: user.id,
      token: refreshToken,
    });
    newRefreshToken.save();

    const response: IResponse = {
      userInfo,
      accessToken,
      refreshToken,
    };

    return response;
  }
}

export default AuthenticateUserService;
