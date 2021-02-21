import Article from "@articles/models/Article";
import IArticleRepository from "@articles/models/IArticleRepository";
import TYPES from "@shared/constants/TYPES";
import { inject, Container, injectable } from "inversify";

interface IRequest {
  slug: string;
}

export interface IGetArticleService {
  execute({ slug }: IRequest): Promise<Article | null>;
}

@injectable()
class GetArticleService implements IGetArticleService {
  constructor(
    @inject(TYPES.IArticleRepository)
    private articleRepository: IArticleRepository
  ) {}

  public async execute({ slug }: IRequest): Promise<Article | null> {
    return await this.articleRepository.getBySlug(slug);
  }
}

export default GetArticleService;
