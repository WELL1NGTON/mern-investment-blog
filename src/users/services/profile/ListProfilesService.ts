import Service from "@shared/services/Service";
import IProfileRepository from "@users/models/IProfileRepository";
import { inject, injectable } from "tsyringe";

interface IRequest {
  pageSize?: number;
  currentPage?: number;
}

@injectable()
class GetProfileService extends Service {
  constructor(
    @inject("ProfileRepository")
    private profileRepository: IProfileRepository
  ) {
    super();
  }

  public async execute({ pageSize, currentPage }: IRequest) {
    return await this.profileRepository.getAll(pageSize, currentPage);
  }
}

export default GetProfileService;
