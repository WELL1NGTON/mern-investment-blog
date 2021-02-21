import Category from "@articles/models/Category";
import ICategoryRepository from "@articles/models/ICategoryRepository";
import TYPES from "@shared/constants/TYPES";
import { inject, Container, injectable } from "inversify";

interface IRequest {
  id: string;
}

export interface IGetCategoryService {
  execute({ id }: IRequest): Promise<Category | null>;
}

@injectable()
class GetCategoryService implements IGetCategoryService {
  constructor(
    @inject(TYPES.ICategoryRepository)
    private categoryRepository: ICategoryRepository
  ) {}

  public async execute({ id }: IRequest): Promise<Category | null> {
    return await this.categoryRepository.getById(id);
  }
}

export default GetCategoryService;
