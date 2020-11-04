import Category, { ICategory } from "@shared/models/category.model";

interface IRequest {
  // limit: number;
  // page: number;
  // search: string[];
}
interface IResponse {
  msg: string;
  categories: ICategory[];
}

class ListArticlesService {
  public async execute({}: // limit,
  // page,
  // search,
  // categories,
  // state,
  // visibility,
  IRequest): Promise<IResponse> {
    const categories: ICategory[] = await Category.find({ visible: true })
      .sort({ createdAt: "desc" })
      .exec();
    // .catch((err) => throw new AppError(err, 400));

    return { msg: `${categories.length} categorias encontrados.`, categories };
  }
}

export default ListArticlesService;
