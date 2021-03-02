import IImagePathRepository from "@images/models/IImagePathRepository";
import ImagePath from "@images/models/ImagePath";
import TYPES from "@shared/constants/TYPES";
import { inject, injectable } from "inversify";

interface IRequest {
  id: string;
}
@injectable()
class GetImageService {
  constructor(
    @inject(TYPES.IImagePathRepository)
    private imagePathRepository: IImagePathRepository
  ) {}

  public async execute({ id }: IRequest): Promise<ImagePath | null> {
    return await this.imagePathRepository.getById(id);
  }
}

export default GetImageService;
