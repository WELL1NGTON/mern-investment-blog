import AppError from "@shared/errors/AppError";
import ImagePath from "@images/models/ImagePath";
import { inject, injectable } from "inversify";
import uploadToFirebase from "@images/utils/uploadToFirebase";
import IImagePathRepository from "@images/models/IImagePathRepository";
import TYPES from "@shared/constants/TYPES";
import SupportedImageFormat from "@images/types/SupportedImageFormat";

interface IRequest {
  file: Express.Multer.File;
  uploadedBy: string;
  name: string;
  tags: string[];
  format?: SupportedImageFormat;
  quality?: number;
  size?: number;
}

@injectable()
class UploadImageService {
  constructor(
    @inject(TYPES.IImagePathRepository)
    private imagePathRepository: IImagePathRepository
  ) {}

  public async execute({
    file,
    name,
    tags,
    quality,
    format,
    size,
    uploadedBy,
  }: IRequest): Promise<ImagePath> {
    // Upload file to firebase
    const uploadedFile = await uploadToFirebase({
      file,
      format,
      quality,
      size,
    });

    // If there is no url throws apperror
    if (uploadedFile.url === "")
      throw new AppError("Erro ao enviar imagem para o firebase");

    // Save uploaded image info to mongo
    const imagePath = new ImagePath(
      `${name}.${format}`,
      tags,
      uploadedFile.url,
      uploadedFile.bucket,
      uploadedFile.firebaseFileName,
      uploadedFile.firebaseStorageDownloadTokens,
      uploadedBy
    );

    await this.imagePathRepository.create(imagePath);

    // const savedImage = await newImage.save();

    return imagePath;
  }
}

export default UploadImageService;
