import IProfileRepository from "@users/models/IProfileRepository";
import IUserRepository from "@users/models/IUserRepository";
import ProfileRepository from "@users/data/repository/ProfileRepository";
import UserRepository from "@users/data/repository/UserRepository";
import { container } from "tsyringe";

container.registerSingleton<IUserRepository>("UserRepository", UserRepository);

container.registerSingleton<IProfileRepository>(
  "ProfileRepository",
  ProfileRepository
);
