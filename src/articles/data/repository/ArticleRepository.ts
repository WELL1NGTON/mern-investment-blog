import ArticleModel, {
  IArticleMongooseDocument,
} from "../mappings/ArticleModel";
import {
  categoryDocumentToEntity,
  categoryEntityToDocument,
} from "./CategoryRepository";
import {
  profileDocumentToEntity,
  profileEntityToDocument,
} from "@users/data/repository/ProfileRepository";

import AppError from "@shared/errors/AppError";
import Article from "src/articles/models/Article";
import IArticleRepository from "src/articles/models/IArticleRepository";
import PagedResult from "@shared/models/PagedResult";
import { StatusCodes } from "http-status-codes";
import TYPES from "@shared/constants/TYPES";
import { injectable } from "inversify";
import mongoose from "mongoose";

const articleDocumentToEntity = (
  document: IArticleMongooseDocument
): Article => {
  const article = new Article(
    document.title,
    document.description,
    document.markdownArticle,
    document.date,

    // document.category ? document.category.toHexString() : undefined,
    // document.author ? document.author.toHexString() : undefined,

    document.category ? categoryDocumentToEntity(document.category) : undefined,
    document.author ? profileDocumentToEntity(document.author) : undefined,

    document.tags,
    document.visibility,
    document.state,
    document.previewImg
  );

  article.id = document._id.toHexString();

  return article;
};

const articleEntityToDocument = (
  article: Article
): IArticleMongooseDocument => {
  return new ArticleModel({
    _id: article.id,
    title: article.title,

    // category: article.category
    //   ? new mongoose.Types.ObjectId(article.category)
    //   : undefined,
    // author: article.author
    //   ? new mongoose.Types.ObjectId(article.author)
    //   : undefined,

    category: article.category
      ? categoryEntityToDocument(article.category)
      : undefined,
    author: article.author
      ? profileEntityToDocument(article.author)
      : undefined,

    description: article.description,
    markdownArticle: article.markdownArticle,
    date: article.date,
    visibility: article.visibility,
    state: article.state,
    tags: article.tags,
    previewImg: article.previewImg,
  });
};

@injectable()
class ArticleRepository implements IArticleRepository {
  public async getAll(
    pageSize = 10,
    currentPage = 1,
    query?: string | undefined
  ): Promise<PagedResult<Article>> {
    let result: IArticleMongooseDocument[];
    let total = 0;
    try {
      result = await ArticleModel.find()
        .sort({ date: "desc" })
        .select("-markdownArticle")
        .populate("author")
        .populate("category")
        // .getPopulatedPaths()
        .limit(pageSize)
        .skip(pageSize * (currentPage - 1))
        .exec();

      total = await ArticleModel.countDocuments().exec();
    } catch (e) {
      result = [];
    }

    const articles: Article[] = result.map((doc) => {
      return articleDocumentToEntity(doc);
    });

    return new PagedResult<Article>(
      articles,
      total,
      currentPage,
      pageSize,
      query
    );
  }

  getAllIgnoringPageSize = async (): Promise<PagedResult<Article>> => {
    let result: IArticleMongooseDocument[];
    let total = 0;
    try {
      result = await ArticleModel.find()
        .sort({ date: "desc" })
        .select("-markdownArticle")
        .populate("author")
        .populate("category")
        .exec();

      total = await ArticleModel.countDocuments().exec();
    } catch (e) {
      result = [];
    }

    const articles: Article[] = result.map((doc) => {
      return articleDocumentToEntity(doc);
    });

    return new PagedResult<Article>(articles, total, 1, total, "");
  };

  public async getById(id: string): Promise<Article | null> {
    const article = await ArticleModel.findById(id)
      .populate("author")
      .populate("category")
      .exec();

    return article ? articleDocumentToEntity(article) : null;
  }

  public async getBySlug(slug: string): Promise<Article | null> {
    const doc = await ArticleModel.findOne({ slug: slug })
      .populate("author")
      .populate("category")
      .exec();

    return doc ? articleDocumentToEntity(doc) : null;
  }

  public async create(article: Article): Promise<null> {
    const newArticle = articleEntityToDocument(article);

    try {
      await newArticle.save();

      return null;
    } catch (e) {
      throw new AppError(
        "Falha ao salvar o artigo",
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }

  public async update(article: Article): Promise<null> {
    const foundArticle = await this.getById(article.id);
    if (!foundArticle)
      throw new AppError(
        "Artigo não pode ser alterado pois não foi encontrado",
        StatusCodes.NOT_FOUND
      );

    const newArticle = articleEntityToDocument(article);

    try {
      await newArticle.updateOne({ _id: article.id }).exec();

      return null;
    } catch {
      throw new AppError(
        "Falha ao alterar o artigo",
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }

  public async delete(id: string): Promise<null> {
    const foundArticle = await this.getById(id);
    if (!foundArticle)
      throw new AppError(
        "Artigo não pode ser excluido pois não foi encontrado",
        StatusCodes.NOT_FOUND
      );

    try {
      await ArticleModel.findByIdAndDelete(id).exec();

      return null;
    } catch {
      throw new AppError(
        "Falha ao excluir o artigo",
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }

  public async deleteBySlug(slug: string): Promise<null> {
    const foundArticle = await this.getBySlug(slug);
    if (!foundArticle)
      throw new AppError(
        "Artigo não pode ser excluido pois não foi encontrado",
        StatusCodes.NOT_FOUND
      );

    try {
      await ArticleModel.findByIdAndDelete(foundArticle.id).exec();

      return null;
    } catch {
      throw new AppError(
        "Falha ao excluir o artigo",
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }

  // public static documentToEntity =

  public documentToEntity = articleDocumentToEntity;
  public entityToDocument = articleEntityToDocument;
}

export default ArticleRepository;
export { articleDocumentToEntity, articleEntityToDocument };
