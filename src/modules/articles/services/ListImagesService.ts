import ImagePath, { IImagePath } from "@shared/models/imagePath.model";

interface IRequest {
  limit?: number;
  page?: number;
  tags?: string[];
}
interface IResponse {
  msg: string;
  images: IImagePath[];
}

class ListImagesService {
  public async execute({
    limit = 10,
    page = 0,
    tags = [],
  }: IRequest): Promise<IResponse> {
    let condition: { [k: string]: any } = {};
    if (tags.length > 0 || tags.length > 0 || tags.length > 0)
      condition["$and"] = [];

    const images = await ImagePath.find(condition)
      .sort({ createdAt: "desc" })
      .skip(page * limit)
      .limit(limit)
      .exec();

    return {
      msg: `${images.length} imagens encontradas.`,
      images,
    };
  }
}

export default ListImagesService;
