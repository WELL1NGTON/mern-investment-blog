import TYPES from "@shared/constants/TYPES";
import IUserRepository from "@users/models/IUserRepository";
import User from "@users/models/User";
import { injectable, inject } from "inversify";

@injectable()
class AuthService {
  constructor(
    @inject(TYPES.IUserRepository) private userRepository: IUserRepository
  ) {}

  public getUserDetails = async (id: string): Promise<User> => {
    const user = await this.userRepository.getById(id);
    return user
      ? Promise.resolve(user)
      : Promise.reject("Usuário não encontrado");
  };
}
export default AuthService;
