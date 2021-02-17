import Service from "@shared/services/Service";
import IUserRepository from "@users/models/IUserRepository";
import { inject, injectable } from "tsyringe";

interface IRequest {
  pageSize?: number;
  currentPage?: number;
}

@injectable()
class ListUsersService extends Service {
  constructor(
    @inject("UserRepository")
    private userRepository: IUserRepository
  ) {
    super();
  }

  public async execute({ pageSize, currentPage }: IRequest) {
    return await this.userRepository.getAll(pageSize, currentPage);
  }
}

export default ListUsersService;
