import IGenericRepository from "@shared/models/IGenericRepository";
import { IRefreshTokenMongooseDocument } from "@auth/data/mappings/RefreshTokenModel";
import RefreshToken from "./RefreshToken";

interface IRefreshTokenRepository
  extends IGenericRepository<RefreshToken, IRefreshTokenMongooseDocument> {
  deleteAllByEmail: (email: string) => Promise<null>;
}

export default IRefreshTokenRepository;
