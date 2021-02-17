import RefreshTokenModel, {
  IRefreshTokenMongooseDocument,
} from "../mappings/RefreshTokenModel";

import AppError from "@shared/errors/AppError";
import IRefreshTokenRepository from "@auth/models/IRefreshTokenRepository";
import PagedResult from "@shared/models/PagedResult";
import RefreshToken from "@auth/models/RefreshToken";
import { StatusCodes } from "http-status-codes";

const refreshTokenDocumentToEntity = (
  document: IRefreshTokenMongooseDocument
): RefreshToken => {
  const refreshToken = new RefreshToken(
    document.email,
    document.token,
    document.expirationDate
  );

  refreshToken.id = document._id;

  return refreshToken;
};
const refreshTokenEntityToDocument = (
  refreshToken: RefreshToken
): IRefreshTokenMongooseDocument => {
  return new RefreshTokenModel({
    _id: refreshToken.id,
    email: refreshToken.email,
    expirationDate: refreshToken.expirationDate,
    token: refreshToken.token,
  });
};

class RefreshTokenRepository implements IRefreshTokenRepository {
  public getAll = async (
    pageSize: number = 10,
    currentPage: number = 1,
    query?: string
  ): Promise<PagedResult<RefreshToken>> => {
    let result: IRefreshTokenMongooseDocument[];
    let total: number = 0;
    try {
      result = await RefreshTokenModel.find()
        .sort({ expirationDate: "desc" })
        .limit(pageSize)
        .skip(pageSize * (currentPage - 1))
        .exec();
      total = await RefreshTokenModel.count();
    } catch (e) {
      result = [];
    }

    const refreshTokens: RefreshToken[] = result.map((doc) =>
      this.documentToEntity(doc)
    );

    return new PagedResult<RefreshToken>(
      refreshTokens,
      total,
      currentPage,
      pageSize,
      query
    );
  };

  getAllIgnoringPageSize = async (): Promise<PagedResult<RefreshToken>> => {
    let result: IRefreshTokenMongooseDocument[];
    let total: number = 0;
    try {
      result = await RefreshTokenModel.find()
        .sort({ expirationDate: "desc" })
        .exec();
      total = await RefreshTokenModel.count();
    } catch (e) {
      result = [];
    }

    const refreshTokens: RefreshToken[] = result.map((doc) =>
      this.documentToEntity(doc)
    );

    return new PagedResult<RefreshToken>(refreshTokens, total, 1, total, "");
  };

  public getById = async (id: string): Promise<RefreshToken | null> => {
    const refreshToken = await RefreshTokenModel.findById(id).exec();

    return refreshToken ? this.documentToEntity(refreshToken) : null;
  };

  public create = async (refreshToken: RefreshToken): Promise<null> => {
    const newRefreshToken = this.entityToDocument(refreshToken);

    try {
      await newRefreshToken.save();

      return null;
    } catch (e) {
      throw new AppError(
        "Falha ao salvar o refreshToken",
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  };

  public update = async (refreshToken: RefreshToken): Promise<null> => {
    const foundRefreshToken = await this.getById(refreshToken.id);

    if (!foundRefreshToken)
      throw new AppError(
        "RefreshToken não pode ser alterado pois não foi encontrado",
        StatusCodes.NOT_FOUND
      );

    const newRefreshToken = this.entityToDocument(refreshToken);

    try {
      await newRefreshToken.updateOne({ _id: refreshToken.id }).exec();

      return null;
    } catch {
      throw new AppError(
        "Falha ao alterar o refreshToken",
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  };

  public delete = async (id: string): Promise<null> => {
    const foundRefreshToken = await this.getById(id);

    if (!foundRefreshToken)
      throw new AppError(
        "RefreshToken não pode ser excluido pois não foi encontrado",
        StatusCodes.NOT_FOUND
      );

    try {
      await RefreshTokenModel.findByIdAndDelete(id).exec();

      return null;
    } catch {
      throw new AppError(
        "Falha ao excluir o refreshToken",
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  };

  deleteAllByEmail = async (email: string): Promise<null> => {
    return await RefreshTokenModel.deleteMany({ email }).exec();
  };

  public documentToEntity = refreshTokenDocumentToEntity;
  public entityToDocument = refreshTokenEntityToDocument;
}

export default RefreshTokenRepository;
