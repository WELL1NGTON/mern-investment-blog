import User from "@shared/models/user.model";
import bcrypt from "bcrypt";
import { decodeResetPasswordToken, IUserInfo } from "@shared/util/jwtTokens";
import AppError from "@shared/errors/AppError";

interface IRequest {
  email?: string;
  token?: string;
  password: string;
}

class ChangePasswordService {
  public async execute({
    email,
    token,
    password,
  }: IRequest): Promise<IUserInfo> {
    if (!email && !token)
      {
      throw new AppError("Token ou email necessários.", 500);

    }

    let user;

    if (token) {
      user = await User.findOne({ resetPasswordToken: token }).exec();
      const decodedEmail = decodeResetPasswordToken(token);
      if (decodedEmail === null) {
      throw new AppError("Token inválido!", 403);

    }
    } else if (email) user = await User.findOne({ email }).exec();

    if (!user) {
      throw new AppError("Usuário não encontrado.", 404);

    }

    let salt: string;
    let hash: string;
    try {
      salt = await bcrypt.genSalt(10);
      hash = await bcrypt.hash(password, salt);
    } catch (err) {
      {
      throw new AppError(err, 500);

    }
    }
    const updatedUser = await User.findByIdAndUpdate(
      { id: user._id },
      { password: hash },
      { upsert: false }
    ).exec();

    if (!updatedUser)
      {
      throw new AppError("Falha ao alterar a senha de usuário.", 500);

    }

    const userInfo: IUserInfo = {
      id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
    };

    return userInfo;
  }
}

export default ChangePasswordService;
