import TYPES from "@shared/constants/TYPES";
import AppError from "@shared/errors/AppError";
import CreateUserAndProfileCommand from "@users/commands/CreateUserAndProfileCommand";
import IProfileRepository from "@users/models/IProfileRepository";
import IUserRepository from "@users/models/IUserRepository";
import Profile from "@users/models/Profile";
import User from "@users/models/User";
import { StatusCodes } from "http-status-codes";
import { inject, Container, injectable } from "inversify";

@injectable()
class CreateUserAndProfileService {
  constructor(
    @inject(TYPES.IUserRepository)
    private userRepository: IUserRepository,
    @inject(TYPES.IProfileRepository)
    private profileRepository: IProfileRepository
  ) {}

  public async execute(command: CreateUserAndProfileCommand): Promise<null> {
    const user = new User(
      command.email,
      command.password,
      command.role,
      command.isActive
    );

    const profile = new Profile(command.name);

    // Encrypt password before saving
    await user.encryptPassword();

    await this.userRepository.create(user);

    // Ensure both have same id
    profile.id = user.id;

    try {
      return await this.profileRepository.create(profile);
    } catch {
      // Ensure that it will only create an user if it can also create also a profile
      await this.userRepository.delete(user.id);
      throw new AppError(
        "Erro ao tentar criar usuário",
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }
}

export default CreateUserAndProfileService;
