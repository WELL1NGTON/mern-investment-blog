import ICategoryRepository from '@articles/models/ICategoryRepository';
import { inject, injectable } from 'tsyringe';

interface IRequest {
  pageSize?: number;
  currentPage?: number;
}

@injectable()
class ListCategoryService {
  constructor(
    @inject('CategoryRepository')
    private categoryRepository: ICategoryRepository
  ) {}

  public async execute({ pageSize, currentPage }: IRequest) {
    return await this.categoryRepository.getAll(pageSize, currentPage);
  }
}

export default ListCategoryService;
