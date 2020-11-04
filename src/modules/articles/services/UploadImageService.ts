import { compressImage } from "@shared/util/fileHelper";
import ImagePath, { IImagePath } from "@shared/models/imagePath.model";

interface IRequest {
  file: Express.Multer.File;
  protocol: string;
  host: string;
  userId: string;
  tags: string[];
  size?: number | null;
}
interface IResponse {
  msg: string;
  image: IImagePath;
}

class UploadImageService {
  public async execute({
    file,
    protocol,
    host,
    userId,
    tags = [],
    size = null,
  }: IRequest): Promise<IResponse> {
    const newPath = await compressImage(file, size);
    // return res.status(500).json("Error on file processing.");
    const newFileName = newPath.replace(/^.*[\\\/]/, "");
    const url = `${protocol}://${host}/images/${newFileName}`;
    const newImagePath: IImagePath = new ImagePath({
      name: newFileName,
      path: newPath,
      url: url,
      articles: [],
      tags,
      user: userId,
    });

    const savedImagePath = await newImagePath.save();

    return {
      msg: "",
      image: savedImagePath,
    };
  }
}

export default UploadImageService;
