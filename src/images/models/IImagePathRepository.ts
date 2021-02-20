import IGenericRepository from "@shared/models/IGenericRepository";
import { IImagePathMongooseDocument } from "@articles/data/mappings/ImagePathModel";
import ImagePath from "./ImagePath";

type IImagePathRepository = IGenericRepository<
  ImagePath,
  IImagePathMongooseDocument
>;

export default IImagePathRepository;
