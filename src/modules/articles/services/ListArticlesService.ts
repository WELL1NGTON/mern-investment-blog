import AppError from "@shared/errors/AppError";
import Article, { IArticle } from "@shared/models/article.model";
import { FilterQuery } from "mongoose";

interface IRequest {
  limit: number;
  page: number;
  search: string[] | string;
  categories: string[];
  state: "EDITING" | "PUBLISHED" | "DELETED" | "";
  visibility: "ALL" | "EDITORS" | "USERS" | "";
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
    let condition: FilterQuery<IArticle>[] = [];
    // console.log(categories);
    // if (categories.length > 0 || state.length > 0 || visibility.length > 0)
    //   condition["$and"] = [];
    if (categories.length > 0) condition.push({ tags: { $all: categories } });
    if (state.length > 0) condition.push({ state });
    if (visibility.length > 0) condition.push({ visibility });

    let queryArticles = Article.fuzzySearch(String(search))
      .sort({ date: "desc" })
      .skip(page * limit)
      .limit(limit)
      .select("-markdownArticle");

    if (condition.length > 0) queryArticles = queryArticles.and(condition);

    const articles: IArticle[] = await queryArticles.exec();
    // .catch((err) => throw new AppError(err, 400));

    return { msg: `${articles.length} artigos encontrados.`, articles };
  }
}

export default ListArticlesService;
