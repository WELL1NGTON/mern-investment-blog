import Article, { IArticle } from "@shared/models/article.model";

interface IRequest {
  title: string;
  description: string;
  markdownArticle: string;
  author: string;
  state: "EDITING" | "PUBLISHED" | "DELETED";
  visibility: "ALL" | "EDITORS" | "USERS";
  dateStr?: string;
  category?: string;
  tags: string[];
  previewImg?: string;
}

interface IResponse {
  message: string;
  article: IArticle;
}

class CreateArticleService {
  /**
   * @description Save new article on the database.
   * @param {IRequest} {
   *     title,
   *     description,
   *     markdownArticle,
   *     author,
   *     state,
   *     visibility,
   *     category,
   *     dateStr,
   *     tags,
   *   }
   * @returns {*}  {Promise<IResponse>}
   * @memberof CreateArticleService
   */
  public async execute({
    title,
    description,
    markdownArticle,
    author,
    state,
    visibility,
    category,
    dateStr,
    tags,
    previewImg,
  }: IRequest): Promise<IResponse> {
    let date = new Date(Date.now());
    if (dateStr) date = new Date(Number(dateStr));

    const newArticle = new Article({
      title,
      description,
      markdownArticle,
      date,
      tags,
      author,
      state,
      visibility,
      category,
      previewImg,
    });

    const articleSaved = await newArticle.save();

    //const updateCategories = new UpdateCategoriesService();

    // const updatedCategories =
    // await updateCategories.execute({
    //   newTags: tags,
    //   oldTags: [],
    // });

    return { message: `Artigo salvo com sucesso.`, article: articleSaved };
  }
}

export default CreateArticleService;
