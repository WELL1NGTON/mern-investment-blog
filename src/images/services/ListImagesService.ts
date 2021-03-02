import IImagePathRepository from "@images/models/IImagePathRepository";
import ImagePath from "@images/models/ImagePath";
import TYPES from "@shared/constants/TYPES";
import PagedResult from "@shared/models/PagedResult";
import { inject, injectable } from "inversify";

interface IRequest {
  pageSize?: number;
  currentPage?: number;
}

@injectable()
class ListImagesService {
  constructor(
    @inject(TYPES.IImagePathRepository)
    private imagePathRepository: IImagePathRepository
  ) {}

  public async execute({
    pageSize,
    currentPage,
  }: IRequest): Promise<PagedResult<ImagePath>> {
    return await this.imagePathRepository.getAll(pageSize, currentPage);
  }
}

export default ListImagesService;
