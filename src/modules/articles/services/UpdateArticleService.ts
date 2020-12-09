import Article, { IArticle } from "@shared/models/article.model";
import AppError from "@shared/errors/AppError";
import StatusCodes from "http-status-codes";
// import async from "async";

const { NOT_FOUND, INTERNAL_SERVER_ERROR, BAD_REQUEST } = StatusCodes;
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
  message: string;
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
      throw new AppError("Formato de data incorreto.", BAD_REQUEST);
    }

    const article = await Article.findOne({ slug }).exec();

    if (!article) {
      throw new AppError("Artigo não encontrado.", NOT_FOUND);
    }

    const updatedArticle = <IArticle>await Article.findByIdAndUpdate(
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
      { upsert: true, new: true }
    );
    console.log(updatedArticle);
    if (!updatedArticle) {
      throw new AppError("Falha ao alterar o artigo.", INTERNAL_SERVER_ERROR);
    }

    // const updateCategories = new UpdateCategoriesService();

    // // const updatedCategories =
    // await updateCategories.execute({
    //   newTags: updatedArticle.tags,
    //   oldTags: article.tags,
    // });

    const response: IResponse = {
      message: "Artigo alterado com sucesso!",
      article: updatedArticle,
    };

    return response;
  }
}

export default UpdateArticleService;
