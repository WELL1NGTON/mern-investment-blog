import Article from "@articles/models/Article";
import IArticleRepository from "@articles/models/IArticleRepository";
import TYPES from "@shared/constants/TYPES";
import PagedResult from "@shared/models/PagedResult";
import { inject, Container, injectable } from "inversify";

interface IRequest {
  pageSize?: number;
  pageIndex?: number;
  ignorePageSize?: boolean;
}

export interface IListArticlesService {
  execute({
    pageSize,
    pageIndex,
    ignorePageSize,
  }: IRequest): Promise<PagedResult<Article>>;
}

@injectable()
class ListArticlesService implements IListArticlesService {
  constructor(
    @inject(TYPES.IArticleRepository)
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

export default ListArticlesService;
