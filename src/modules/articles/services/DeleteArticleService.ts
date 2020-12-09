import Article from "@shared/models/article.model";
import AppError from "@shared/errors/AppError";

interface IRequest {
  slug: string;
}
interface IResponse {
  message: string;
}

class DeleteArticleService {
  /**
   * @description Find one article by it's "slug" field and delete it
   * @param {IRequest} { slug }
   * @returns {*}  {Promise<IResponse>}
   * @memberof DeleteArticleService
   */
  public async execute({ slug }: IRequest): Promise<IResponse> {
    const article = await Article.findOne({ slug }).exec();

    if (!article) {
      throw new AppError("Artigo não encontrado.", 404);
    }

    await Article.findByIdAndDelete({ id: article._id });

    return { message: "Success!" };
  }
}

export default DeleteArticleService;
