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
    @inject("UserRepository")
    private userRepository: IUserRepository
  ) {}

  public async execute({ id }: IRequest): Promise<User | null> {
    return await this.userRepository.getById(id);
  }
}

export default GetUserService;
