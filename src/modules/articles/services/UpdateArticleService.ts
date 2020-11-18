import Article, { IArticle } from "@shared/models/article.model";
import UpdateCategoriesService from "./UpdateCategoriesService";
import AppError from "@shared/errors/AppError";

interface IRequest {
  slug: string;
  title: string;
  description: string;
  markdownArticle: string;
  author: string;
  state: "EDITING" | "PUBLISHED" | "DELETED";
  visibility: "ALL" | "EDITORS" | "USERS";
  dateStr: string;
  category: string;
  tags: string[];
}
interface IResponse {
  msg: string;
  article: IArticle;
}

class UpdateArticleService {
  public async execute({
    slug,
    title,
    description,
    markdownArticle,
    author,
    state,
    visibility,
    dateStr,
    category,
    tags,
  }: IRequest): Promise<IResponse> {
    const date = new Date(Date.parse(String(dateStr)));

    if (!date) {
      throw new AppError("Formato de data incorreto.", 400);
    }

    const article = await Article.findOne({ slug }).exec();

    if (!article) {
      throw new AppError("Artigo não encontrado.", 404);
    }


    const updatedArticle = await Article.findByIdAndUpdate(
      article._id,
      {
        title,
        description,
        markdownArticle,
        author,
        state,
        visibility,
        date,
        category,
        tags,
      },
      { upsert: true }
    );

    if (!updatedArticle) {
      throw new AppError("Falha ao alterar o artigo.", 500);
    }

    const updateCategories = new UpdateCategoriesService();

    // const updatedCategories =
    await updateCategories.execute({
      newTags: updatedArticle.tags,
      oldTags: article.tags,
    });

    const response: IResponse = {
      msg: "Artigo alterado com sucesso!",
      article: updatedArticle,
    };

    return response;
  }
}

export default UpdateArticleService;
