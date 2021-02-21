import CreateCategoryCommand from "@articles/commands/CreateCategoryCommand";
import Category from "@articles/models/Category";
import ICategoryRepository from "@articles/models/ICategoryRepository";
import TYPES from "@shared/constants/TYPES";
import { inject, Container, injectable } from "inversify";

export interface ICreateCategoryService {
  execute(command: CreateCategoryCommand): Promise<null>;
}

@injectable()
class CreateCategoryService implements ICreateCategoryService {
  constructor(
    @inject(TYPES.ICategoryRepository)
    private categoryRepository: ICategoryRepository
  ) {}

  public async execute(command: CreateCategoryCommand): Promise<null> {
    const category = new Category(
      command.name,
      command.color,
      command.visibility
    );

    return await this.categoryRepository.create(category);
  }
}

export default CreateCategoryService;
