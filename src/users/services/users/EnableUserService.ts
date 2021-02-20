import AppError from "@shared/errors/AppError";
import Service from "@shared/services/Service";
import IUserRepository from "@users/models/IUserRepository";
import { StatusCodes } from "http-status-codes";
import { inject, injectable } from "tsyringe";

interface IRequest {
  id: string;
}

@injectable()
class EnableUserService extends Service {
  constructor(
    @inject("UserRepository")
    private userRepository: IUserRepository
  ) {
    super();
  }

  public async execute({ id }: IRequest): Promise<null> {
    const user = await this.userRepository.getById(id);

    // Check if user exists
    if (user === null)
      throw new AppError(
        "Falha ao habilitar a conta de usuário pois o usuário não foi encontrado",
        StatusCodes.NOT_FOUND
      );

    // Enable user's account
    user.isActive = true;

    // Try to commit changes
    try {
      return await this.userRepository.update(user);
    } catch {
      throw new AppError(
        "Ocorreu um erro ao tentar habilitar a conta de usuário",
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }
}

export default EnableUserService;
