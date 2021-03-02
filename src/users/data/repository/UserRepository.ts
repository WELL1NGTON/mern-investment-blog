import UserModel, { IUserMongooseDocument } from "../mappings/UserModel";

import AppError from "@shared/errors/AppError";
import IUserRepository from "@users/models/IUserRepository";
import PagedResult from "@shared/models/PagedResult";
import Role from "@shared/types/Role";
import { StatusCodes } from "http-status-codes";
import User from "@users/models/User";
import { injectable } from "inversify";

const userDocumentToEntity = (document: IUserMongooseDocument): User => {
  const user = new User(
    document.email,
    document.password,
    document.role as Role,
    document.isActive
  );

  user.id = document._id.toHexString();

  return user;
};
const userEntityToDocument = (user: User): IUserMongooseDocument => {
  return new UserModel({
    _id: user.id,
    email: user.email.value,
    password: user.password,
    role: user.role,
    isActive: user.isActive,
  });
};

@injectable()
class UserRepository implements IUserRepository {
  public getAll = async (
    pageSize = 10,
    currentPage = 1,
    query?: string | undefined
  ): Promise<PagedResult<User>> => {
    let result: IUserMongooseDocument[];
    let total = 0;
    try {
      result = await UserModel.find().sort({ date: "desc" }).exec();
      total = await UserModel.count();
    } catch (e) {
      result = [];
    }

    const categories: User[] = result.map((doc) => this.documentToEntity(doc));

    return new PagedResult<User>(
      categories,
      total,
      currentPage,
      pageSize,
      query
    );
  };

  getAllIgnoringPageSize = async (): Promise<PagedResult<User>> => {
    let result: IUserMongooseDocument[];
    let total = 0;
    try {
      result = await UserModel.find().sort({ date: "desc" }).exec();
      total = await UserModel.count();
    } catch (e) {
      result = [];
    }

    const categories: User[] = result.map((doc) => this.documentToEntity(doc));

    return new PagedResult<User>(categories, total, 1, total, "");
  };

  public getById = async (id: string): Promise<User | null> => {
    const user = await UserModel.findById(id).exec();

    return user ? this.documentToEntity(user) : null;
  };

  public getByEmail = async (email: string): Promise<User | null> => {
    const user = await UserModel.findOne({ email }).exec();

    return user ? this.documentToEntity(user) : null;
  };

  public create = async (user: User): Promise<null> => {
    const newUser = this.entityToDocument(user);

    try {
      await newUser.save();

      return null;
    } catch (e) {
      throw new AppError(
        "Falha ao salvar o user",
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  };

  public update = async (user: User): Promise<null> => {
    const foundUser = await this.getById(user.id);

    if (!foundUser)
      throw new AppError(
        "Usuário não pode ser alterado pois não foi encontrado",
        StatusCodes.NOT_FOUND
      );

    const newUser = this.entityToDocument(user);

    try {
      await newUser.updateOne({ _id: user.id }).exec();

      return null;
    } catch {
      throw new AppError(
        "Falha ao alterar o usuário",
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  };

  public delete = async (id: string): Promise<null> => {
    const foundUser = await this.getById(id);
    if (!foundUser)
      throw new AppError(
        "Usuário não pode ser excluido pois não foi encontrado",
        StatusCodes.NOT_FOUND
      );

    try {
      await UserModel.findByIdAndDelete(id).exec();

      return null;
    } catch {
      throw new AppError(
        "Falha ao excluir o usuário",
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  };

  public documentToEntity = userDocumentToEntity;

  public entityToDocument = userEntityToDocument;
}

export default UserRepository;

export { userDocumentToEntity, userEntityToDocument };
