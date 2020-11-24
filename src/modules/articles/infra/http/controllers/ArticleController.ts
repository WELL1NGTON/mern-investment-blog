import { Request, Response } from "express";
import CreateArticleService from "@modules/articles/services/CreateArticleService";
import UpdateArticleService from "@modules/articles/services/UpdateArticleService";
import DeleteArticleService from "@modules/articles/services/DeleteArticleService";
import ListArticlesService from "@modules/articles/services/ListArticlesService";
import ShowArticleService from "@modules/articles/services/ShowArticleService";
// import { container } from "tsyringe";
import StatusCodes from "http-status-codes";
import aqp from "api-query-params";
import { IArticle } from "@shared/models/article.model";

const { CREATED, OK, NO_CONTENT } = StatusCodes;

export default class ArticlesController {
  public async show(request: Request, response: Response): Promise<Response> {
    const { slug } = request.params;

    const showArticle = new ShowArticleService();

    const { article } = await showArticle.execute({
      slug,
    });

    return response.status(OK).json({
      msg: "Artigo encontrado!",
      article,
    });
  }

  public async create(request: Request, response: Response): Promise<Response> {
    const {
      title,
      description,
      markdownArticle,
      date,
      tags,
      author,
      state,
      visibility,
    } = request.body;

    console.log("date", date);

    const createArticle = new CreateArticleService();

    const { article } = await createArticle.execute({
      title,
      description,
      markdownArticle,
      dateStr: date ? date : Date.now(),
      tags,
      author,
      state,
      visibility,
    });

    return response.status(CREATED).json({
      msg: "Artigo criado com sucesso!",
      article: article,
    });
  }

  public async update(request: Request, response: Response): Promise<Response> {
    const {
      title,
      description,
      markdownArticle,
      date,
      tags,
      author,
      state,
      visibility,
      category,
    } = request.body;
    const slug = request.params.slug;

    const updateArticle = new UpdateArticleService();

    const { article } = await updateArticle.execute({
      slug,
      title,
      description,
      markdownArticle,
      dateStr: date,
      tags,
      author,
      state,
      visibility,
      category,
    });

    return response.status(CREATED).json({
      msg: `Artigo ${slug} atualizado com sucesso!`,
      article: article,
    });
  }

  public async delete(request: Request, response: Response): Promise<Response> {
    const slug = request.params.slug;

    const deleteArticle = new DeleteArticleService();

    await deleteArticle.execute({ slug });

    return response.status(NO_CONTENT).json({
      msg: `Artigo ${slug} excluido com sucesso!`,
    });
  }

  public async list(request: Request, response: Response): Promise<Response> {
    const { filter, skip, limit } = aqp<IArticle>(request.query, {
      blacklist: ["state", "visibility", "search"],
      skipKey: "page",
    });

    const search = request.query["search"] || "";
    const state = "PUBLISHED";
    const visibility = "ALL";

    const listArticles = new ListArticlesService();

    const articles = await listArticles.execute({
      limit,
      skip,
      search: String(search),
      filter,
      state,
      visibility,
    });

    return response.status(OK).json(articles);
  }

  public async listAll(
    request: Request,
    response: Response
  ): Promise<Response> {
    const { filter, skip, limit } = aqp<IArticle>(request.query, {
      blacklist: ["search"],
      skipKey: "page",
    });
    const search = request.query["search"] || "";

    const listArticles = new ListArticlesService();

    const articles = await listArticles.execute({
      limit,
      skip,
      search: String(search),
      filter,
    });

    return response.status(OK).json(articles);
  }
}
