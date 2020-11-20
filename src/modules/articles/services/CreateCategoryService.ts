import Category, { ICategory } from "@shared/models/category.model";

interface IRequest {
  name: string;
  color?: string;
  visible?: boolean;
}

interface IResponse {
  msg: string;
  category: ICategory;
}

class CreateCategoryService {
  /**
   * @description Saves a new category onto the database.
   * @param {IRequest} { name, visible, color }
   * @returns {*}  {Promise<IResponse>}
   * @memberof CreateCategoryService
   */
  public async execute({ name, visible, color }: IRequest): Promise<IResponse> {
    const category = new Category({ name, visible, color });

    const saved = await category.save();

    return { msg: `Categoria salva com sucesso.`, category: saved };
  }
}

export default CreateCategoryService;
