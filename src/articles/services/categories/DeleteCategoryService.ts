import ICategoryRepository from "@articles/models/ICategoryRepository";
import { inject, injectable } from "tsyringe";

interface IRequest {
  id: string;
}

@injectable()
class DeleteCategoryService {
  constructor(
    @inject("CategoryRepository")
    private categoryRepository: ICategoryRepository
  ) {}

  public async execute({ id }: IRequest): Promise<null> {
    return await this.categoryRepository.delete(id);
  }
}

export default DeleteCategoryService;
