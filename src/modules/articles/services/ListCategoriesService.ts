import Category, { ICategory } from "@shared/models/category.model";

interface IRequest {
  // limit: number;
  // page: number;
  // search: string[];
}
interface IResponse {
  message: string;
  categories: ICategory[];
}

class ListCategoriesService {
  /**
   * @description Returns all categories.
   * @returns {*}  {Promise<IResponse>}
   * @memberof ListCategoriesService
   */
  public async execute(): Promise<IResponse> {
    const categories: ICategory[] = await Category.find({ visible: true })
      .sort({ createdAt: "desc" })
      .exec();

    return {
      message: `${categories.length} categorias encontrados.`,
      categories,
    };
  }
}

export default ListCategoriesService;
