import TYPES from "@shared/constants/TYPES";
import IProfileRepository from "@users/models/IProfileRepository";
import Profile from "@users/models/Profile";
import { inject, Container, injectable } from "inversify";
import { provide, buildProviderModule } from "inversify-binding-decorators";

interface IRequest {
  id: string;
}

export interface IGetProfileService {
  execute({ id }: IRequest): Promise<Profile | null>;
}

@injectable()
class GetProfileService implements IGetProfileService {
  constructor(
    @inject(TYPES.IProfileRepository)
    private profileRepository: IProfileRepository
  ) {}

  public async execute({ id }: IRequest): Promise<Profile | null> {
    return await this.profileRepository.getById(id);
  }
}

export default GetProfileService;
