import UpdateCategoryCommand from "@articles/commands/UpdateCategoryCommand";
import Category from "@articles/models/Category";
import ICategoryRepository from "@articles/models/ICategoryRepository";
import TYPES from "@shared/constants/TYPES";
import AppError from "@shared/errors/AppError";
import { StatusCodes } from "http-status-codes";
import { inject, Container, injectable } from "inversify";

@injectable()
class UpdateCategoryService {
  constructor(
    @inject(TYPES.ICategoryRepository)
    private categoryRepository: ICategoryRepository
  ) {}

  public async execute(command: UpdateCategoryCommand): Promise<void> {
    const storedCategory = await this.categoryRepository.getById(command.id);

    if (!storedCategory)
      throw new AppError(
        "A Categoria que você estava tentando atualizar não existe",
        StatusCodes.NOT_FOUND
      );

    const category = new Category(
      command.name,
      command.color,
      command.visibility
    );

    category.id = command.id;

    await this.categoryRepository.update(category);
  }
}

export default UpdateCategoryService;
