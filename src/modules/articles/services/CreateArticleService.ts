import Article, { IArticle } from "@shared/models/article.model";
import UpdateCategoriesService from "./UpdateCategoriesService";

interface IRequest {
  title: string;
  description: string;
  markdownArticle: string;
  author: string;
  state: "EDITING" | "PUBLISHED" | "DELETED";
  visibility: "ALL" | "EDITORS" | "USERS";
  dateStr: string;
  tags: string[];
}
interface IResponse {
  msg: string;
  article: IArticle;
}

class CreateArticleService {
  public async execute({
    title,
    description,
    markdownArticle,
    author,
    state,
    visibility,
    dateStr,
    tags,
  }: IRequest): Promise<IResponse> {
    const date = Date.parse(String(dateStr));

    const newArticle = new Article({
      title,
      description,
      markdownArticle,
      date,
      tags,
      author,
      state,
      visibility,
      // previewImg: imgUrl
    });

    const articleSaved = await newArticle.save();

    const updateCategories = new UpdateCategoriesService();

    // const updatedCategories =
    await updateCategories.execute({
      newTags: tags,
      oldTags: [],
    });

    return { msg: `Artigo salvo com sucesso.`, article: articleSaved };
  }
}

export default CreateArticleService;
