import Service from "@shared/services/Service";
import IUserRepository from "@users/models/IUserRepository";
import { inject, injectable } from "tsyringe";

interface IRequest {
  id: string;
}

@injectable()
class GetUserService extends Service {
  constructor(
    @inject("UserRepository")
    private userRepository: IUserRepository
  ) {
    super();
  }

  public async execute({ id }: IRequest) {
    return await this.userRepository.getById(id);
  }
}

export default GetUserService;
