import AppError from "@shared/errors/AppError";
import Password from "@shared/richObjects/Password";
import Service from "@shared/services/Service";
import IUserRepository from "@users/models/IUserRepository";
import { StatusCodes } from "http-status-codes";
import { injectable, inject } from "tsyringe";

interface IRequest {
  oldPassword: string;
  newPassword: string;
  id: string;
}

@injectable()
class ChangeUserPasswordService extends Service {
  constructor(
    @inject("UserRepository")
    private userRepository: IUserRepository
  ) {
    super();
  }

  // TODO: Alterar para mongoose transaction
  public async execute({ oldPassword, newPassword, id }: IRequest) {
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