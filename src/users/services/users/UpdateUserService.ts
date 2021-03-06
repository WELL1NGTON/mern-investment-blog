import TYPES from "@shared/constants/TYPES";
import AppError from "@shared/errors/AppError";
import Service from "@shared/services/Service";
import UpdateUserCommand from "@users/commands/UpdateUserCommand";
import IUserRepository from "@users/models/IUserRepository";
import User from "@users/models/User";
import { StatusCodes } from "http-status-codes";
import { inject, injectable } from "inversify";

@injectable()
class UpdateUserService implements Service {
  constructor(
    @inject(TYPES.IUserRepository)
    private userRepository: IUserRepository
  ) {}

  public async execute(command: UpdateUserCommand): Promise<void> {
    const storedUser = await this.userRepository.getById(command.id);

    if (!storedUser)
      throw new AppError(
        "A Categoria que você estava tentando atualizar não existe",
        StatusCodes.NOT_FOUND
      );

    const user = new User(
      command.email,
      command.password,
      command.role,
      command.isActive
    );

    user.id = command.id;

    await this.userRepository.update(user);

    return;
  }
}

export default UpdateUserService;
