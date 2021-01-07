import User from "@shared/models/user.model";
import { IUserInfo } from "@shared/util/jwtTokens";
import AppError from "@shared/errors/AppError";

interface IRequest {
  name: string;
  email: string;
  image?: string;
  info?: string;
}

interface IResponse {
  userInfo: IUserInfo;
}

class UpdateProfileService {
  public async execute({ name, email, image, info }: IRequest): Promise<IResponse> {
    const user = await User.findOne({ email }).exec();

    if (!user) {
      throw new AppError("Usuário não existe.", 400);
    }

    const updatedUser = await User.findByIdAndUpdate(
      { id: user._id },
      { name, image, info },
      { upsert: false }
    ).exec();

    if (!updatedUser) {
      throw new AppError("Falha ao alterar a senha de usuário.", 500);
    }

    const userInfo: IUserInfo = {
      id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
      info: updatedUser.info,
      image: updatedUser.image,
    };

    const response: IResponse = { userInfo };

    return response;
  }
}
export default UpdateProfileService;
