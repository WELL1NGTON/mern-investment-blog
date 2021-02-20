import Service from "@shared/services/Service";
import IProfileRepository from "@users/models/IProfileRepository";
import Profile from "@users/models/Profile";
import { inject, injectable } from "tsyringe";

interface IRequest {
  id: string;
}

@injectable()
class GetProfileService extends Service {
  constructor(
    @inject("ProfileRepository")
    private profileRepository: IProfileRepository
  ) {
    super();
  }

  public async execute({ id }: IRequest): Promise<Profile | null> {
    return await this.profileRepository.getById(id);
  }
}

export default GetProfileService;
