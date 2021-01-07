import User from "@shared/models/user.model";
import { IUserInfo } from "@shared/util/jwtTokens";
import AppError from "@shared/errors/AppError";

interface IRequest {
  email: string;
}

interface IResponse {
  userInfo: IUserInfo;
}

class ShowProfileService {
  public async execute({ email }: IRequest): Promise<IResponse> {
    const user = await User.findOne({ email }).exec();

    if (!user) {
      throw new AppError("Usuário não existe.", 400);

    }

    const userInfo: IUserInfo = {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      info: user.info,
      image: user.image,
    };

    const response: IResponse = {
      userInfo,
    };

    return response;
  }
}

export default ShowProfileService;
