import IRefreshTokenRepository from '@auth/models/IRefreshTokenRepository';
import TYPES from '@shared/constants/TYPES';
import AppError from '@shared/errors/AppError';
import { StatusCodes } from 'http-status-codes';
import { inject, injectable } from 'inversify';

interface IRequest {
  email: string;
}

@injectable()
class LogoutService {
  constructor(
    @inject(TYPES.IRefreshTokenRepository)
    private refreshTokenRepository: IRefreshTokenRepository
  ) {}

  public async execute({ email }: IRequest): Promise<null> {
    try {
      return await this.refreshTokenRepository.deleteAllByEmail(email);
    } catch {
      throw new AppError(
        "Falha na tentativa de logout",
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }
}

export default LogoutService;
