import IArticleRepository from "@articles/models/IArticleRepository";
import { inject, injectable } from "tsyringe";

interface IRequest {
  slug: string;
}

@injectable()
class DeleteArticleService {
  constructor(
    @inject("ArticleRepository")
    private articleRepository: IArticleRepository
  ) {}

  public async execute({ slug }: IRequest) {
    return await this.articleRepository.delete(slug);
  }
}

export default DeleteArticleService;
