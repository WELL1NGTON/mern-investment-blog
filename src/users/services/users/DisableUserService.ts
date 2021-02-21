import AppError from "@shared/errors/AppError";
import Service from "@shared/services/Service";
import IUserRepository from "@users/models/IUserRepository";
import { StatusCodes } from "http-status-codes";
import { inject, injectable } from "inversify";

interface IRequest {
  id: string;
}

@injectable()
class DisableUserService implements Service {
  constructor(
    @inject("UserRepository")
    private userRepository: IUserRepository
  ) {}

  public async execute({ id }: IRequest): Promise<null> {
    const user = await this.userRepository.getById(id);

    // Check if user exists
    if (user === null)
      throw new AppError(
        "Falha ao desabilitar a conta de usuário pois o usuário não foi encontrado",
        StatusCodes.NOT_FOUND
      );

    // Disable user's account
    user.isActive = false;

    // Try to commit changes
    try {
      return await this.userRepository.update(user);
    } catch {
      throw new AppError(
        "Ocorreu um erro ao tentar desabilitar a conta de usuário",
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }
}

export default DisableUserService;
