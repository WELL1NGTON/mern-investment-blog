import Category from "@articles/models/Category";
import ICategoryRepository from "@articles/models/ICategoryRepository";
import { inject, injectable } from "tsyringe";

interface IRequest {
  id: string;
}

@injectable()
class GetCategoryService {
  constructor(
    @inject("CategoryRepository")
    private categoryRepository: ICategoryRepository
  ) {}

  public async execute({ id }: IRequest): Promise<Category | null> {
    return await this.categoryRepository.getById(id);
  }
}

export default GetCategoryService;
