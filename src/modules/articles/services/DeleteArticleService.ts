import Article from "@shared/models/article.model";
import UpdateCategoriesService from "./UpdateCategoriesService";
import AppError from "@shared/errors/AppError";

interface IRequest {
  slug: string;
}
interface IResponse {
  msg: string;
}

class CreateArticleService {
  public async execute({ slug }: IRequest): Promise<IResponse> {
    const article = await Article.findOne({ slug }).exec();

    if (!article) throw new AppError("Artigo não encontrado.", 404);

    await Article.findByIdAndDelete({ id: article._id });

    const updateCategories = new UpdateCategoriesService();

    // const updatedCategories =
    await updateCategories.execute({
      newTags: [],
      oldTags: article.tags,
    });

    return { msg: "Success!" };
  }
}

export default CreateArticleService;
