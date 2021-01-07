import User from "@shared/models/user.model";
import bcrypt from "bcrypt";

import { IUserInfo } from "@shared/util/jwtTokens";
import AppError from "@shared/errors/AppError";

interface IRequest {
  name: string;
  email: string;
  password: string;
  role: string;
  image?: string;
  info?: string;
}
interface IResponse {
  userInfo: IUserInfo;
}

class CreateUserService {
  public async execute({
    name,
    email,
    password,
    role,
    image,
    info
  }: IRequest): Promise<IResponse> {
    const user = await User.findOne({ email }).exec();

    if (user) {
      throw new AppError("Email já cadastrado.", 400);

    }

    const newUser = new User({
      name,
      email,
      password,
      role,
      image,
      info
    });

    try {
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(newUser.password, salt);

      newUser.password = hash;

      const savedUser = await newUser.save();

      const userInfo: IUserInfo = {
        id: savedUser._id,
        name: savedUser.name,
        email: savedUser.email,
        role: savedUser.role,
        info: savedUser.info,
        image: savedUser.image,
      };

      return { userInfo };
    } catch (err) {

      throw new AppError(err, 500);

    }
  }
}

export default CreateUserService;
