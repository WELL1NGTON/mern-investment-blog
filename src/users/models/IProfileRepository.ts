import IGenericRepository from "@shared/models/IGenericRepository";
import { IProfileMongooseDocument } from "@users/data/mappings/ProfileModel";
import Profile from "./Profile";

interface IProfileRepository
  extends IGenericRepository<Profile, IProfileMongooseDocument> {}

export default IProfileRepository;
