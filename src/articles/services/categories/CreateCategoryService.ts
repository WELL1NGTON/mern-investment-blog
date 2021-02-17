import CreateCategoryCommand from "@articles/commands/CreateCategoryCommand";
import Category from "@articles/models/Category";
import ICategoryRepository from "@articles/models/ICategoryRepository";
import Color from "@shared/richObjects/Color";
import { inject, injectable } from "tsyringe";

@injectable()
class CreateCategoryService {
  constructor(
    @inject("CategoryRepository")
    private categoryRepository: ICategoryRepository
  ) {}

  public async execute(command: CreateCategoryCommand) {
    const category = new Category(
      command.name,
      command.color,
      command.visibility
    );

    return await this.categoryRepository.create(category);
  }
}

export default CreateCategoryService;
