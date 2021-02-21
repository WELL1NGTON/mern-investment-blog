import ImagePathModel, {
  IImagePathMongooseDocument,
} from "../mappings/ImagePathModel";

import AppError from "@shared/errors/AppError";
import IImagePathRepository from "@images/models/IImagePathRepository";
import ImagePath from "@images/models/ImagePath";
import PagedResult from "@shared/models/PagedResult";
import { StatusCodes } from "http-status-codes";
import { injectable } from "inversify";
import mongoose from "mongoose";

const imagePathDocumentToEntity = (
  document: IImagePathMongooseDocument
): ImagePath => {
  const imagePath = new ImagePath(
    document.name,
    document.tags,
    document.url,
    document.bucket,
    document.firebaseFileName,
    document.firebaseStorageDownloadTokens,
    document.uploadedBy.toHexString()
  );

  imagePath.id = document._id;

  return imagePath;
};
const imagePathEntityToDocument = (
  imagePath: ImagePath
): IImagePathMongooseDocument => {
  return new ImagePathModel({
    _id: imagePath.id,
    slug: imagePath.slug,
    name: imagePath.name,
    tags: imagePath.tags,
    url: imagePath.url,
    bucket: imagePath.bucket,
    firebaseFileName: imagePath.firebaseFileName,
    firebaseStorageDownloadTokens: imagePath.firebaseStorageDownloadTokens,
    uploadedBy: imagePath.uploadedBy
      ? new mongoose.Types.ObjectId(imagePath.uploadedBy)
      : undefined,
  });
};

@injectable()
class ImagePathRepository implements IImagePathRepository {
  public async getAll(
    pageSize = 10,
    currentPage = 1,
    query?: string | undefined
  ): Promise<PagedResult<ImagePath>> {
    let result: IImagePathMongooseDocument[];
    let total = 0;
    try {
      result = await ImagePathModel.find()
        .sort({ name: "asc" })
        .limit(pageSize)
        .skip(pageSize * (currentPage - 1))
        .exec();
      total = await ImagePathModel.count();
    } catch (e) {
      result = [];
    }
    const imagePath: ImagePath[] = result.map((doc) =>
      this.documentToEntity(doc)
    );

    return new PagedResult<ImagePath>(
      imagePath,
      total,
      currentPage,
      pageSize,
      query
    );
  }

  getAllIgnoringPageSize = async (): Promise<PagedResult<ImagePath>> => {
    let result: IImagePathMongooseDocument[];
    let total = 0;
    try {
      result = await ImagePathModel.find().sort({ name: "asc" }).exec();
      total = await ImagePathModel.count();
    } catch (e) {
      result = [];
    }

    const imagePath: ImagePath[] = result.map((doc) =>
      this.documentToEntity(doc)
    );

    return new PagedResult<ImagePath>(imagePath, total, 1, total, "");
  };

  public async getById(id: string): Promise<ImagePath | null> {
    const imagePath = await ImagePathModel.findById(id).exec();

    return imagePath ? this.documentToEntity(imagePath) : null;
  }
  public async create(imagePath: ImagePath): Promise<null> {
    const newImagePath = this.entityToDocument(imagePath);

    try {
      await newImagePath.save();

      return null;
    } catch (e) {
      throw new AppError(
        "Falha ao salvar a categoria",
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }

  public async update(imagePath: ImagePath): Promise<null> {
    const foundImagePath = await this.getById(imagePath.id);
    if (!foundImagePath)
      throw new AppError(
        "Categoria não pode ser alterada pois não foi encontrada",
        StatusCodes.NOT_FOUND
      );

    const newImagePath = this.entityToDocument(imagePath);

    try {
      await newImagePath.updateOne({ _id: imagePath.id }).exec();

      return null;
    } catch {
      throw new AppError(
        "Falha ao alterar a categoria",
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }

  public async delete(id: string): Promise<null> {
    const foundImagePath = await this.getById(id);
    if (!foundImagePath)
      throw new AppError(
        "Categoria não pode ser excluida pois não foi encontrada",
        StatusCodes.NOT_FOUND
      );

    try {
      await ImagePathModel.findByIdAndDelete(id).exec();

      return null;
    } catch {
      throw new AppError(
        "Falha ao excluir a categoria",
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }

  public documentToEntity = imagePathDocumentToEntity;
  public entityToDocument = imagePathEntityToDocument;
}

export default ImagePathRepository;
