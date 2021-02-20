import AppError from "@shared/errors/AppError";
import Service from "@shared/services/Service";
import UpdateProfileCommand from "@users/commands/UpdateProfileCommand";
import IProfileRepository from "@users/models/IProfileRepository";
import Profile from "@users/models/Profile";
import { StatusCodes } from "http-status-codes";
import { inject, injectable } from "tsyringe";

@injectable()
class GetProfileService extends Service {
  constructor(
    @inject("ProfileRepository")
    private profileRepository: IProfileRepository
  ) {
    super();
  }

  public async execute(command: UpdateProfileCommand): Promise<void> {
    const storedProfile = await this.profileRepository.getById(command.id);

    if (!storedProfile)
      throw new AppError(
        "A Categoria que você estava tentando atualizar não existe",
        StatusCodes.NOT_FOUND
      );

    const profile = new Profile(
      command.name,
      command.about,
      command.profileImage,
      command.contact
    );

    profile.id = command.id;

    await this.profileRepository.update(profile);
  }
}

export default GetProfileService;
