import TYPES from "@shared/constants/TYPES";
import PagedResult from "@shared/models/PagedResult";
import IProfileRepository from "@users/models/IProfileRepository";
import Profile from "@users/models/Profile";
import { inject, Container, injectable } from "inversify";
import { provide, buildProviderModule } from "inversify-binding-decorators";

interface IRequest {
  pageSize?: number;
  currentPage?: number;
}

export interface IListProfilesService {
  execute({ pageSize, currentPage }: IRequest): Promise<PagedResult<Profile>>;
}

@injectable()
class ListProfilesService implements IListProfilesService {
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
