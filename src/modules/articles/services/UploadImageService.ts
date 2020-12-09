import Image, { IImage } from "@shared/models/image.model";
import { compressImage } from "@shared/util/fileHelper";
// import ImagePath, { IImagePath } from "@shared/models/imagePath.model";

// interface IRequest {
//   file: Express.Multer.File;
//   protocol: string;
//   host: string;
//   userId: string;
//   tags: string[];
//   size?: number | null;
// }
// interface IResponse {
//   message: string;
//   image: IImagePath;
// }

// class UploadImageService {
//   public async execute({
//     file,
//     protocol,
//     host,
//     userId,
//     tags = [],
//     size = null,
//   }: IRequest): Promise<IResponse> {
//     const newPath = await compressImage(file, size);
//     // return res.status(500).json("Error on file processing.");
//     const newFileName = newPath.replace(/^.*[\\\/]/, "");
//     const url = `${protocol}://${host}/images/${newFileName}`;
//     const newImagePath: IImagePath = new ImagePath({
//       name: newFileName,
//       path: newPath,
//       url: url,
//       articles: [],
//       tags,
//       user: userId,
//     });

//     const savedImagePath = await newImagePath.save();

//     return {
//       message: "",
//       image: savedImagePath,
//     };
//   }
// }

interface IRequest {
  file: Express.Multer.File;
  uploadedBy: string;
  name: string;
  tags: string[];
  format?: "jpg" | "jpeg" | "png" | "webp";
  quality?: number;
  size?: number;
}
interface IResponse {
  message: string;
  image: IImage;
}

class UploadImageService {
  public async execute({
    file,
    name,
    tags,
    quality,
    format = "jpg",
    size,
    uploadedBy,
  }: IRequest): Promise<IResponse> {
    const buffer = await compressImage(file, format, quality, size);

    // console.log(buffer);
    const newImage: IImage = new Image({
      name: `${name}.${format}`,
      tags,
      // image: buffer,
      binData: { data: buffer, contentType: "image/" + format },
      uploadedBy,
    });

    // newImage.image.data = buffer;

    const savedImage = await newImage.save();

    return {
      message: "",
      image: savedImage,
    };
  }
}

export default UploadImageService;
