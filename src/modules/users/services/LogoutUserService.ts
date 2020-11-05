import RefreshToken from "@shared/models/refreshToken.model";
import AppError from "@shared/errors/AppError";

interface IRequest {
  refreshToken: string;
}

interface IResponse {
  success: boolean;
}

class LogoutUserService {
  public async execute({ refreshToken }: IRequest): Promise<IResponse> {
    const token = await RefreshToken.findOneAndDelete({
      token: refreshToken,
    }).exec();

    if (!token) {
      throw new AppError("Usuário não está autenticado.", 400);
    }

    return { success: true };
  }
}

export default LogoutUserService;
