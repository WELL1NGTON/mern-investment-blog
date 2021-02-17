import Service from "@shared/services/Service";
import IProfileRepository from "@users/models/IProfileRepository";
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

  public async execute({ id }: IRequest) {
    return await this.profileRepository.getById(id);
  }
}

export default GetProfileService;
