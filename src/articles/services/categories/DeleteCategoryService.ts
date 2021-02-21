import ICategoryRepository from "@articles/models/ICategoryRepository";
import TYPES from "@shared/constants/TYPES";
import { inject, Container, injectable } from "inversify";

interface IRequest {
  id: string;
}

export interface IDeleteCategoryService {
  execute({ id }: IRequest): Promise<null>;
}

@injectable()
class DeleteCategoryService implements IDeleteCategoryService {
  constructor(
    @inject(TYPES.ICategoryRepository)
    private categoryRepository: ICategoryRepository
  ) {}

  public async execute({ id }: IRequest): Promise<null> {
    return await this.categoryRepository.delete(id);
  }
}

export default DeleteCategoryService;
