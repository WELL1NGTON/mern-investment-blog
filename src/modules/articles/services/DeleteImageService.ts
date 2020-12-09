import AppError from "@shared/errors/AppError";
import Image from "@shared/models/image.model";
// import path from "path";
// import fs from "fs";

interface IRequest {
  slug: string;
}
interface IResponse {
  message: string;
}

class UploadImageService {
  /**
   * @description Delete image from local storage.
   * @param {IRequest} { fileName }
   * @returns {*}  {Promise<IResponse>}
   * @memberof UploadImageService
   */
  public async execute({ slug }: IRequest): Promise<IResponse> {
    // const filePath = `./public/images/${fileName}`;
    // const resolvedPath = path.resolve(filePath);

    const image = await Image.findOneAndDelete({ slug });

    if (!image) {
      throw new AppError("Imagem não encontrada.", 404);
    }

    // fs.unlink(resolvedPath, (err) => {
    //   if (err) {
    //     console.log(err);
    //     throw new AppError("File not deleted.", 500);
    //   }
    // });
    return { message: `Arquivo ${image.name} deletado.` };
  }
}

export default UploadImageService;
