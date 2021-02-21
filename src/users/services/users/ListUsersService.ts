import TYPES from "@shared/constants/TYPES";
import PagedResult from "@shared/models/PagedResult";
import Service from "@shared/services/Service";
import IUserRepository from "@users/models/IUserRepository";
import User from "@users/models/User";
import { inject, injectable } from "inversify";
import { TYPE } from "inversify-express-utils";

interface IRequest {
  pageSize?: number;
  currentPage?: number;
}

@injectable()
class ListUsersService implements Service {
  constructor(
    @inject(TYPES.IUserRepository)
    private userRepository: IUserRepository
  ) {}

  public async execute({
    pageSize,
    currentPage,
  }: IRequest): Promise<PagedResult<User>> {
    return await this.userRepository.getAll(pageSize, currentPage);
  }
}

export default ListUsersService;
