import AppError from "@shared/errors/AppError";
import Article, { IArticle } from "@shared/models/article.model";
import { FilterQuery } from "mongoose";
import aqp from "api-query-params";

interface IRequest {
  limit: number;
  skip: number;
  search: string[] | string;
  filter: FilterQuery<IArticle>;
  // categories: string[];
  state?: "EDITING" | "PUBLISHED" | "DELETED" | "";
  visibility?: "ALL" | "EDITORS" | "USERS" | "";
}
interface IResponse {
  message: string;
  articles: IArticle[];
}

class ListArticlesService {
  /**
   * @description Search and
   * @param {IRequest} {
   *     limit,
   *     page,
   *     search,
   *     categories,
   *     state,
   *     visibility,
   *   }
   * @returns {*}  {Promise<IResponse>}
   * @memberof ListArticlesService
   */
  public async execute({
    limit,
    skip,
    search,
    // categories,
    filter,
    state,
    visibility,
  }: IRequest): Promise<IResponse> {
    // let condition: FilterQuery<IArticle>[] = [];
    // console.log(categories);
    // if (categories.length > 0 || state.length > 0 || visibility.length > 0)
    //   condition["$and"] = [];
    // if (categories.length > 0) condition.push({ tags: { $all: categories } });
    // if (state.length > 0) condition.push({ state });
    // if (visibility.length > 0) condition.push({ visibility });

    let queryArticles = Article.fuzzySearch(String(search))
      .find(filter)
      .sort({ date: "desc" })
      .skip(skip * limit)
      .limit(limit)
      .select("-markdownArticle");

    if (state && state.length > 0) queryArticles.find({ state });
    if (visibility && visibility.length > 0) queryArticles.find({ visibility });
    // if (condition.length > 0) queryArticles = queryArticles.and(condition);

    const articles: IArticle[] = await queryArticles.exec();
    // .catch((err) => throw new AppError(err, 400));

    return { message: `${articles.length} artigos encontrados.`, articles };
  }
}

export default ListArticlesService;
