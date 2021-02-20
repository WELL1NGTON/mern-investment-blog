import Category from "@articles/models/Category";
import ICategoryRepository from "@articles/models/ICategoryRepository";
import PagedResult from "@shared/models/PagedResult";
import { inject, injectable } from "tsyringe";

interface IRequest {
  pageSize?: number;
  currentPage?: number;
}

@injectable()
class ListCategoryService {
  constructor(
    @inject("CategoryRepository")
    private categoryRepository: ICategoryRepository
  ) {}

  public async execute({
    pageSize,
    currentPage,
  }: IRequest): Promise<PagedResult<Category>> {
    return await this.categoryRepository.getAll(pageSize, currentPage);
  }
}

export default ListCategoryService;
