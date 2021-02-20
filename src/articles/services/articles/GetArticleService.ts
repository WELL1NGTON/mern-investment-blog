import Article from "@articles/models/Article";
import IArticleRepository from "@articles/models/IArticleRepository";
import { inject, injectable } from "tsyringe";

interface IRequest {
  slug: string;
}

@injectable()
class GetArticleService {
  constructor(
    @inject("ArticleRepository")
    private articleRepository: IArticleRepository
  ) {}

  public async execute({ slug }: IRequest): Promise<Article | null> {
    return await this.articleRepository.getBySlug(slug);
  }
}

export default GetArticleService;
