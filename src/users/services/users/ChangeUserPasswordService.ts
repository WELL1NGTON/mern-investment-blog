import TYPES from "@shared/constants/TYPES";
import AppError from "@shared/errors/AppError";
import Password from "@shared/richObjects/Password";
import IUserRepository from "@users/models/IUserRepository";
import { StatusCodes } from "http-status-codes";
import { Container, inject, injectable } from "inversify";

interface IRequest {
  oldPassword: string;
  newPassword: string;
  id: string;
}

export interface IChangeUserPasswordService {
  execute({ oldPassword, newPassword, id }: IRequest): Promise<null>;
}

@injectable()
class ChangeUserPasswordService implements IChangeUserPasswordService {
  constructor(
    @inject(TYPES.IUserRepository)
    private userRepository: IUserRepository
  ) {}

  // TODO: Alterar para mongoose transaction
  public async execute({
    oldPassword,
    newPassword,
    id,
  }: IRequest): Promise<null> {
    const user = await this.userRepository.getById(id);

    // Check if user exists
    if (user === null)
      throw new AppError(
        "Falha ao alterar senha, usuário não encontrado",
        StatusCodes.NOT_FOUND
      );

    // Decrypt password and check if it checks with informed old password
    if (!Password.isMatch(oldPassword, user.password))
      throw new AppError(
        "Para alterar a senha, por favor, informe a senha antiga",
        StatusCodes.BAD_REQUEST
      );

    // set new password and encrypt it
    user.password = newPassword;
    await user.encryptPassword();

    // Try to commit changes
    try {
      return await this.userRepository.update(user);
    } catch {
      throw new AppError(
        "Ocorreu um erro ao tentar alterar a senha",
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }
}

export default ChangeUserPasswordService;
