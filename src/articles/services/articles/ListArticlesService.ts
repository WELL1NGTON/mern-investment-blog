import Article from "@articles/models/Article";
import IArticleRepository from "@articles/models/IArticleRepository";
import PagedResult from "@shared/models/PagedResult";
import { inject, injectable } from "tsyringe";

interface IRequest {
  pageSize?: number;
  pageIndex?: number;
  ignorePageSize?: boolean;
}

@injectable()
class ListArticleService {
  constructor(
    @inject("ArticleRepository")
    private articleRepository: IArticleRepository
  ) {}

  public async execute({
    pageSize,
    pageIndex,
    ignorePageSize,
  }: IRequest): Promise<PagedResult<Article>> {
    if (ignorePageSize)
      return await this.articleRepository.getAllIgnoringPageSize();
    return await this.articleRepository.getAll(pageSize, pageIndex);
  }
}

export default ListArticleService;
