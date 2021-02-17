import ProfileModel, {
  IProfileMongooseDocument,
} from "../mappings/ProfileModel";

import AppError from "@shared/errors/AppError";
import IProfileRepository from "@users/models/IProfileRepository";
import PagedResult from "@shared/models/PagedResult";
import Profile from "@users/models/Profile";
import { StatusCodes } from "http-status-codes";

const profileDocumentToEntity = (
  document: IProfileMongooseDocument
): Profile => {
  const profile = new Profile(
    document.name,
    document.about,
    document.profileImage,
    document.contact
  );

  profile.id = document._id;

  return profile;
};
const profileEntityToDocument = (
  profile: Profile
): IProfileMongooseDocument => {
  return new ProfileModel({
    _id: profile.id,
    name: profile.name,
    about: profile.about,
    profileImage: profile.profileImage,
    contact: profile.contact,
  });
};

class ProfileRepository implements IProfileRepository {
  constructor() { }

  public getAll = async (
    pageSize: number = 10,
    currentPage: number = 1,
    query?: string
  ): Promise<PagedResult<Profile>> => {
    let result: IProfileMongooseDocument[];
    let total: number = 0;
    try {
      result = await ProfileModel.find()
        .sort({ name: "desc" })
        .limit(pageSize)
        .skip(pageSize * (currentPage - 1))
        .exec();
      total = await ProfileModel.count();
    } catch (e) {
      result = [];
    }

    const categories: Profile[] = result.map((doc) =>
      this.documentToEntity(doc)
    );

    return new PagedResult<Profile>(
      categories,
      total,
      currentPage,
      pageSize,
      query
    );
  };

  getAllIgnoringPageSize = async (): Promise<PagedResult<Profile>> => {
    let result: IProfileMongooseDocument[];
    let total: number = 0;
    try {
      result = await ProfileModel.find()
        .sort({ name: "desc" })
        .exec();
      total = await ProfileModel.count();
    } catch (e) {
      result = [];
    }

    const categories: Profile[] = result.map((doc) =>
      this.documentToEntity(doc)
    );

    return new PagedResult<Profile>(
      categories,
      total,
      1,
      total,
      ""
    );
  };


  public getById = async (id: string): Promise<Profile | null> => {
    const profile = await ProfileModel.findById(id).exec();

    return profile ? this.documentToEntity(profile) : null;
  };

  public create = async (profile: Profile): Promise<null> => {
    const newProfile = this.entityToDocument(profile);

    try {
      await newProfile.save();

      return null;
    } catch {
      throw new AppError(
        "Falha ao salvar o profile",
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  };

  public update = async (profile: Profile): Promise<null> => {
    const foundProfile = await this.getById(profile.id);

    if (!foundProfile)
      throw new AppError(
        "Profile não pode ser alterado pois não foi encontrado",
        StatusCodes.NOT_FOUND
      );

    const newProfile = this.entityToDocument(profile);

    try {
      await newProfile.updateOne({ _id: profile.id }).exec();

      return null;
    } catch {
      throw new AppError(
        "Falha ao alterar o profile",
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  };

  public delete = async (id: string): Promise<null> => {
    const foundProfile = await this.getById(id);

    if (!foundProfile)
      throw new AppError(
        "Profile não pode ser excluido pois não foi encontrado",
        StatusCodes.NOT_FOUND
      );

    try {
      await ProfileModel.findByIdAndDelete(id).exec();

      return null;
    } catch {
      throw new AppError(
        "Falha ao excluir o profile",
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  };

  public documentToEntity = profileDocumentToEntity;
  public entityToDocument = profileEntityToDocument;
}

export default ProfileRepository;

export { profileDocumentToEntity, profileEntityToDocument };
