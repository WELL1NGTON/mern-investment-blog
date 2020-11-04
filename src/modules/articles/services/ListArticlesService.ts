import Article, { IArticle } from "@shared/models/article.model";
import { FilterQuery } from "mongoose";

interface IRequest {
  limit: number;
  page: number;
  search: string[] | string;
  categories: string[] | string;
  state: "EDITING" | "PUBLISHED" | "DELETED";
  visibility: "ALL" | "EDITORS" | "USERS";
}
interface IResponse {
  msg: string;
  articles: IArticle[];
}

class ListArticlesService {
  public async execute({
    limit,
    page,
    search,
    categories,
    state,
    visibility,
  }: IRequest): Promise<IResponse> {
    let condition: FilterQuery<IArticle> = {};
    if (categories.length > 0 || state.length > 0 || visibility.length > 0)
      condition["$and"] = [];
    if (categories.length > 0)
      condition["$and"]?.push({ tags: { $all: Array(categories) } });
    if (state.length > 0) condition["$and"]?.push({ state });
    if (visibility.length > 0) condition["$and"]?.push({ visibility });

    const articles: IArticle[] = await Article.fuzzySearch(
      String(search),
      condition
    )
      .sort({ date: "desc" })
      .skip(page * limit)
      .limit(limit)
      .select("-markdownArticle")
      .exec();
    // .catch((err) => throw new AppError(err, 400));

    return { msg: `${articles.length} artigos encontrados.`, articles };
  }
}

export default ListArticlesService;
