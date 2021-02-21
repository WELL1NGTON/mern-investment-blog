import Category from "@articles/models/Category";
import ICategoryRepository from "@articles/models/ICategoryRepository";
import TYPES from "@shared/constants/TYPES";
import PagedResult from "@shared/models/PagedResult";
import { inject, Container, injectable } from "inversify";

interface IRequest {
  pageSize?: number;
  currentPage?: number;
}

@injectable()
class ListCategoriesService {
  constructor(
    @inject(TYPES.ICategoryRepository)
    private categoryRepository: ICategoryRepository
  ) {}

  public async execute({
    pageSize,
    currentPage,
  }: IRequest): Promise<PagedResult<Category>> {
    return await this.categoryRepository.getAll(pageSize, currentPage);
  }
}

export default ListCategoriesService;
