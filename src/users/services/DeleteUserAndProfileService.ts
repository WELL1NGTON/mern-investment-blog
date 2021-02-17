import AppError from "@shared/errors/AppError";
import Service from "@shared/services/Service";
import IProfileRepository from "@users/models/IProfileRepository";
import IUserRepository from "@users/models/IUserRepository";
import { StatusCodes } from "http-status-codes";
import { inject, injectable } from "tsyringe";

interface IRequest {
  id: string;
}

@injectable()
class DeleteUserAndProfileService extends Service {
  constructor(
    @inject("UserRepository")
    private userRepository: IUserRepository,
    @inject("ProfileRepository")
    private profileRepository: IProfileRepository
  ) {
    super();
  }

  public async execute({ id }: IRequest) {
    const user = await this.userRepository.getById(id);
    const profile = await this.profileRepository.getById(id);

    // TODO: Alterar para mongoose transaction
    if (user === null || profile === null)
      throw new AppError(
        "Erro ao tentar excluir o usuário, não foi possível encontrar o usuário informado",
        StatusCodes.NOT_FOUND
      );

    await this.profileRepository.delete(id);
    try {
      return await this.userRepository.delete(id);
    } catch {
      // if it wasn't possible to delete user, try to recreate the profile
      await this.profileRepository.create(profile);
      throw new AppError(
        "Erro ao tentar excluir o usuário",
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }
}

export default DeleteUserAndProfileService;
