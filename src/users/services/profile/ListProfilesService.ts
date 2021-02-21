import TYPES from "@shared/constants/TYPES";
import PagedResult from "@shared/models/PagedResult";
import IProfileRepository from "@users/models/IProfileRepository";
import Profile from "@users/models/Profile";
import { inject, Container, injectable } from "inversify";

interface IRequest {
  pageSize?: number;
  currentPage?: number;
}

@injectable()
class ListProfilesService {
  constructor(
    @inject(TYPES.IProfileRepository)
    private profileRepository: IProfileRepository
  ) {}

  public async execute({
    pageSize,
    currentPage,
  }: IRequest): Promise<PagedResult<Profile>> {
    return await this.profileRepository.getAll(pageSize, currentPage);
  }
}

export default ListProfilesService;
