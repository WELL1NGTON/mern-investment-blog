import Article, { IArticle } from "@shared/models/article.model";
import AppError from "@shared/errors/AppError";

interface IRequest {
  slug: string;
}
interface IResponse {
  msg: string;
  article: IArticle;
}

class ShowArticleService {
  public async execute({ slug }: IRequest): Promise<IResponse> {
    const article = await Article.findOne({ slug });

    if (!article) {
      throw new AppError("File not found.", 404);
    }

    return { msg: `Artigo salvo com sucesso.`, article };
  }
}

export default ShowArticleService;
