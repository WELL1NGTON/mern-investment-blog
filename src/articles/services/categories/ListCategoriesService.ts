import Category from "@articles/models/Category";
import ICategoryRepository from "@articles/models/ICategoryRepository";
import TYPES from "@shared/constants/TYPES";
import PagedResult from "@shared/models/PagedResult";
import { inject, Container, injectable } from "inversify";

interface IRequest {
  pageSize?: number;
  currentPage?: number;
}

export interface IListCategoriesService {
  execute({ pageSize, currentPage }: IRequest): Promise<PagedResult<Category>>;
}

@injectable()
class ListCategoriesService implements IListCategoriesService {
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
