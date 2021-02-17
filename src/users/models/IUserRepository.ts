import IGenericRepository from "@shared/models/IGenericRepository";
import { IUserMongooseDocument } from "@users/data/mappings/UserModel";
import User from "./User";

interface IUserRepository
  extends IGenericRepository<User, IUserMongooseDocument> {
  getByEmail: (email: string) => Promise<User | null>;
}

export default IUserRepository;
