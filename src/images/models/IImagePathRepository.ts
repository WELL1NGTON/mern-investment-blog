import IGenericRepository from "@shared/models/IGenericRepository";
import { IImagePathMongooseDocument } from "@articles/data/mappings/ImagePathModel";
import ImagePath from "./ImagePath";

interface IImagePathRepository
  extends IGenericRepository<ImagePath, IImagePathMongooseDocument> {}

export default IImagePathRepository;
