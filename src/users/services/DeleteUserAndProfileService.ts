import TYPES from "@shared/constants/TYPES";
import AppError from "@shared/errors/AppError";
import IProfileRepository from "@users/models/IProfileRepository";
import IUserRepository from "@users/models/IUserRepository";
import { StatusCodes } from "http-status-codes";
import { inject, Container, injectable } from "inversify";
import { provide, buildProviderModule } from "inversify-binding-decorators";

interface IRequest {
  id: string;
}

export interface IDeleteUserAndProfileService {
  execute({ id }: IRequest): Promise<null>;
}

@injectable()
class DeleteUserAndProfileService implements IDeleteUserAndProfileService {
  constructor(
    @inject(TYPES.IUserRepository)
    private userRepository: IUserRepository,
    @inject(TYPES.IProfileRepository)
    private profileRepository: IProfileRepository
  ) {}

  public async execute({ id }: IRequest): Promise<null> {
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
