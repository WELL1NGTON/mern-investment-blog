import AppError from "@shared/errors/AppError";
import ImagePath from "@shared/models/imagePath.model";
import path from "path";
import fs from "fs";

interface IRequest {
  fileName: string;
}
interface IResponse {
  msg: string;
}

class UploadImageService {
  public async execute({ fileName }: IRequest): Promise<IResponse> {
    const filePath = `./public/images/${fileName}`;
    const resolvedPath = path.resolve(filePath);

    const imagePath = await ImagePath.findOneAndDelete({ name: fileName });

    if (!imagePath) throw new AppError("Imagem não encontrada.", 404);

    fs.unlink(resolvedPath, (err) => {
      if (err) {
        console.log(err);
        throw new AppError("File not deleted.", 500);
      }
    });
    return { msg: `file ${fileName} deleted.` };
  }
}

export default UploadImageService;
