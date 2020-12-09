import Image, { IImage } from "@shared/models/image.model";
import AppError from "@shared/errors/AppError";

interface IRequest {
  slug: string;
}

interface IResponse {
  message: string;
  imageInfo: IImage;
}

class ShowArticleService {
  public async execute({ slug }: IRequest): Promise<IResponse> {
    const imageInfo = await Image.findOne({ slug });

    if (!imageInfo) {
      throw new AppError("File not found.", 404);
    }

    return { message: `Imagem encontrada com sucesso.`, imageInfo };
  }
}

export default ShowArticleService;
