import ICategoryRepository from "@articles/models/ICategoryRepository";
import IImagePathRepository from "@images/models/IImagePathRepository";
import TYPES from "@shared/constants/TYPES";
import { inject, Container, injectable } from "inversify";

interface IRequest {
  id: string;
}

@injectable()
class DeleteImageService {
  constructor(
    @inject(TYPES.IImagePathRepository)
    private imagePathRepository: IImagePathRepository
  ) {}

  public async execute({ id }: IRequest): Promise<null> {
    return await this.imagePathRepository.delete(id);

    // TODO: Also delete from firebase
  }
}

export default DeleteImageService;
