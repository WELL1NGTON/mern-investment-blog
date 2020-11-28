import { FilterQuery } from "mongoose";
import Image, { IImage } from "@shared/models/image.model";

interface IRequest {
  filter: FilterQuery<IImage>;
  limit?: number;
  skip?: number;
}
interface IResponse {
  msg: string;
  images: IImage[];
}

class ListImagesService {
  public async execute({
    limit = 20,
    skip = 0,
    filter,
  }: IRequest): Promise<IResponse> {
    // let condition: { [k: string]: any } = {};
    // if (tags.length > 0 || tags.length > 0 || tags.length > 0)
    //   condition["$and"] = [];

    const images = await Image.find(filter)
      .sort({ createdAt: "desc" })
      .skip(skip)
      .limit(limit)
      .select("-binData")
      .exec();

    return {
      msg: `${images.length} imagens encontradas.`,
      images,
    };
  }
}

export default ListImagesService;
