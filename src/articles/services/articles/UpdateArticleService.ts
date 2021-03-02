import UpdateArticleCommand from "@articles/commands/UpdateArticleCommand";
import Article from "@articles/models/Article";
import Category from "@articles/models/Category";
import IArticleRepository from "@articles/models/IArticleRepository";
import ICategoryRepository from "@articles/models/ICategoryRepository";
import TYPES from "@shared/constants/TYPES";
import AppError from "@shared/errors/AppError";
import IProfileRepository from "@users/models/IProfileRepository";
import { StatusCodes } from "http-status-codes";
import { inject, Container, injectable } from "inversify";

export interface IUpdateArticleService {
  execute(command: UpdateArticleCommand): Promise<void>;
}
@injectable()
class UpdateArticleService implements IUpdateArticleService {
  constructor(
    @inject(TYPES.IArticleRepository)
    private articleRepository: IArticleRepository,
    @inject(TYPES.ICategoryRepository)
    private categoryRepository: ICategoryRepository,
    @inject(TYPES.IProfileRepository)
    private profileRepository: IProfileRepository
  ) {}

  public async execute(command: UpdateArticleCommand): Promise<void> {
    const storedArticle = await this.articleRepository.getBySlug(command.slug);

    if (!storedArticle)
      throw new AppError(
        "O Artigo que você estava tentando atualizar não existe",
        StatusCodes.NOT_FOUND
      );

    if (typeof command.authorId === "undefined")
      //TODO: alterar para pegar author do token
      throw new AppError(
        "O Artigo precisa de um autor",
        StatusCodes.BAD_REQUEST
      );

    // Repository: verificar se author existe, caso contrário app error
    const author = await this.profileRepository.getById(command.authorId);

    if (!author)
      throw new AppError("Author não encontrado", StatusCodes.NOT_FOUND);

    let category: Category | null | undefined;
    if (typeof command.categoryId !== "undefined")
      category = await this.categoryRepository.getById(command.categoryId);

    const article = new Article(
      command.title,
      command.description,
      command.markdownArticle,
      command.date,
      category ? category : undefined,
      author ? author : undefined,
      command.tags,
      command.visibility,
      command.state,
      command.previewImg
    );

    article.id = storedArticle.id;

    await this.articleRepository.update(article);
  }
}

export default UpdateArticleService;
