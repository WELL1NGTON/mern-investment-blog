import ImagePath, { IImagePath } from "@shared/models/imagePath.model";

import { FilterQuery } from "mongoose";

interface IRequest {
  filter: FilterQuery<IImagePath>;
  limit?: number;
  skip?: number;
}
interface IResponse {
  message: string;
  images: IImagePath[];
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

    const images = await ImagePath.find(filter)
      .sort({ createdAt: "desc" })
      .skip(skip)
      .limit(limit)
      .select("-binData")
      .exec();

    return {
      message: `${images.length} imagens encontradas.`,
      images,
    };
  }
}

export default ListImagesService;
