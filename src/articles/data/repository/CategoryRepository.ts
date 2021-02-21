import CategoryModel, {
  ICategoryMongooseDocument,
} from "../mappings/CategoryModel";

import AppError from "@shared/errors/AppError";
import Category from "@articles/models/Category";
import ICategoryRepository from "@articles/models/ICategoryRepository";
import PagedResult from "@shared/models/PagedResult";
import { StatusCodes } from "http-status-codes";
import Visibility from "@shared/types/Visibility";
import { injectable } from "inversify";

const categoryDocumentToEntity = (
  document: ICategoryMongooseDocument
): Category => {
  const category = new Category(
    document.name,
    document.color,
    document.visibility as Visibility
  );

  category.id = document._id;

  return category;
};
const categoryEntityToDocument = (
  category: Category
): ICategoryMongooseDocument => {
  return new CategoryModel({
    _id: category.id,
    name: category.name,
    visibility: category.visibility,
    color: category.color.value,
  });
};

@injectable()
class CategoryRepository implements ICategoryRepository {
  public async getAll(
    pageSize = 10,
    currentPage = 1,
    query?: string | undefined
  ): Promise<PagedResult<Category>> {
    let result: ICategoryMongooseDocument[];
    let total = 0;
    try {
      result = await CategoryModel.find()
        .sort({ name: "asc" })
        .limit(pageSize)
        .skip(pageSize * (currentPage - 1))
        .exec();
      total = await CategoryModel.count();
    } catch (e) {
      result = [];
    }
    const categories: Category[] = result.map((doc) =>
      this.documentToEntity(doc)
    );

    return new PagedResult<Category>(
      categories,
      total,
      currentPage,
      pageSize,
      query
    );
  }

  getAllIgnoringPageSize = async (): Promise<PagedResult<Category>> => {
    let result: ICategoryMongooseDocument[];
    let total = 0;
    try {
      result = await CategoryModel.find().sort({ name: "asc" }).exec();
      total = await CategoryModel.count();
    } catch (e) {
      result = [];
    }

    const categories: Category[] = result.map((doc) =>
      this.documentToEntity(doc)
    );

    return new PagedResult<Category>(categories, total, 1, total, "");
  };

  public async getById(id: string): Promise<Category | null> {
    const category = await CategoryModel.findById(id).exec();

    return category ? this.documentToEntity(category) : null;
  }
  public async create(category: Category): Promise<null> {
    const newCategory = this.entityToDocument(category);

    try {
      await newCategory.save();

      return null;
    } catch (e) {
      throw new AppError(
        "Falha ao salvar a categoria",
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }

  public async update(category: Category): Promise<null> {
    const foundCategory = await this.getById(category.id);
    if (!foundCategory)
      throw new AppError(
        "Categoria não pode ser alterada pois não foi encontrada",
        StatusCodes.NOT_FOUND
      );

    const newCategory = this.entityToDocument(category);

    try {
      await newCategory.updateOne({ _id: category.id }).exec();

      return null;
    } catch {
      throw new AppError(
        "Falha ao alterar a categoria",
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }

  public async delete(id: string): Promise<null> {
    const foundCategory = await this.getById(id);
    if (!foundCategory)
      throw new AppError(
        "Categoria não pode ser excluida pois não foi encontrada",
        StatusCodes.NOT_FOUND
      );

    try {
      await CategoryModel.findByIdAndDelete(id).exec();

      return null;
    } catch {
      throw new AppError(
        "Falha ao excluir a categoria",
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }

  public documentToEntity = categoryDocumentToEntity;
  public entityToDocument = categoryEntityToDocument;
}

export default CategoryRepository;
export { categoryDocumentToEntity, categoryEntityToDocument };
