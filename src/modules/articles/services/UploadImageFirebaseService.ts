import ImagePath, { IImagePath } from "@shared/models/imagePath.model";

import AppError from "@shared/errors/AppError";
import compressImage from "@shared/util/fileHelper";
import uploadToFirebase from "@shared/util/uploadToFirebase";

interface IRequest {
  file: Express.Multer.File;
  uploadedBy: string;
  name: string;
  tags: string[];
  format?: "jpg" | "jpeg" | "png" | "webp" | string;
  quality?: number;
  size?: number;
}
interface IResponse {
  message: string;
  image: IImagePath;
}

class UploadImageService {
  public async execute({
    file,
    name,
    tags,
    quality,
    format,
    size,
    uploadedBy,
  }: IRequest): Promise<IResponse> {
    // Upload file to firebase
    const uploadedFile = await uploadToFirebase({ file, format, quality, size });

    // If there is no url throws apperror
    if (uploadedFile.url === '') throw new AppError("Erro ao enviar imagem para o firebase");

    // Save uploaded image info to mongo
    const newImage: IImagePath = new ImagePath({
      name: `${name}.${format}`,
      tags,
      uploadedBy,
      url: uploadedFile.url,
      bucket: uploadedFile.bucket,
      firebaseStorageDownloadTokens: uploadedFile.firebaseStorageDownloadTokens,
      firebaseFileName: uploadedFile.firebaseFileName
    });

    const savedImage = await newImage.save();

    return {
      message: "Imagem enviada com sucesso.",
      image: savedImage,
    };
  }
}

export default UploadImageService;
