import TYPES from "@shared/constants/TYPES";
import IProfileRepository from "@users/models/IProfileRepository";
import Profile from "@users/models/Profile";
import { inject, injectable } from "inversify";

interface IRequest {
  id: string;
}

@injectable()
class GetProfileService {
  constructor(
    @inject(TYPES.IProfileRepository)
    private profileRepository: IProfileRepository
  ) {}

  public async execute({ id }: IRequest): Promise<Profile | null> {
    return await this.profileRepository.getById(id);
  }
}

export default GetProfileService;
