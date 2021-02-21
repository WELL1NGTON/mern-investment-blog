import TYPES from "@shared/constants/TYPES";
import Service from "@shared/services/Service";
import IUserRepository from "@users/models/IUserRepository";
import User from "@users/models/User";
import { inject, injectable } from "inversify";

interface IRequest {
  id: string;
}

@injectable()
class GetUserService implements Service {
  constructor(
    @inject(TYPES.IUserRepository)
    private userRepository: IUserRepository
  ) {}

  public async execute({ id }: IRequest): Promise<User | null> {
    return await this.userRepository.getById(id);
  }
}

export default GetUserService;
