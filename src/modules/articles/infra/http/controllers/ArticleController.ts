import { Request, Response } from "express";
import CreateArticleService from "@modules/articles/services/CreateArticleService";
import UpdateArticleService from "@modules/articles/services/UpdateArticleService";
import DeleteArticleService from "@modules/articles/services/DeleteArticleService";
import ListArticlesService from "@modules/articles/services/ListArticlesService";
import ShowArticleService from "@modules/articles/services/ShowArticleService";
// import { container } from "tsyringe";

export default class ArticlesController {
  public async show(request: Request, response: Response): Promise<Response> {
    const { slug } = request.params;

    const showArticle = new ShowArticleService();

    const { article } = await showArticle.execute({
      slug,
    });

    return response.status(200).json({
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

    return response.status(201).json({
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
    });

    return response.status(201).json({
      msg: `Artigo ${slug} atualizado com sucesso!`,
      article: article,
    });
  }

  public async delete(request: Request, response: Response): Promise<Response> {
    const slug = request.params.slug;

    const deleteArticle = new DeleteArticleService();

    await deleteArticle.execute({ slug });

    return response.status(201).json({
      msg: `Artigo ${slug} excluido com sucesso!`,
    });
  }

  public async list(request: Request, response: Response): Promise<Response> {
    const limit = Number(request.query["limit"]) || 10;
    const page = Number(request.query["page"]) || 0;
    const search = request.query["search"] || "";
    const categories = request.query["category"]
      ? Array(request.query["category"])
      : [];
    const state = "PUBLISHED";
    const visibility = "ALL";

    const listArticles = new ListArticlesService();

    let categoriesString: string[] = [];
    for (const category of categories) {
      if (typeof category === "string") {
        categoriesString.push(category);
      }
    }

    let articles;

    articles = await listArticles.execute({
      limit,
      page,
      search: String(search),
      categories: categoriesString,
      state,
      visibility,
    });

    return response.status(200).json(articles);
  }

  public async listAll(
    request: Request,
    response: Response
  ): Promise<Response> {
    const limit = Number(request.query["limit"]) || 10;
    const page = Number(request.query["page"]) || 0;
    const search = request.query["search"] || "";
    const categories = request.query["category"]
      ? Array(request.query["category"])
      : [];
    const state: string =
      typeof request.query["state"] === "string" ? request.query["state"] : "";
    const visibility: string =
      typeof request.query["visibility"] === "string"
        ? request.query["visibility"]
        : "";

    if (
      state !== "EDITING" &&
      state !== "PUBLISHED" &&
      state !== "DELETED" &&
      state !== ""
    )
      return response.status(404).json({
        msg: "Invalid state.",
      });

    if (
      visibility !== "ALL" &&
      visibility !== "EDITORS" &&
      visibility !== "USERS" &&
      visibility !== ""
    )
      return response.status(404).json({
        msg: "Invalid visibility.",
      });

    let categoriesString: string[] = [];
    for (const category of categories) {
      if (typeof category === "string") {
        categoriesString.push(category);
      }
    }

    const listArticles = new ListArticlesService();
    // const listArticles = container.resolve(ListArticlesService);

    const articles = await listArticles.execute({
      limit,
      page,
      search: String(search),
      categories: categoriesString,
      state,
      visibility,
    });

    return response.status(200).json(articles);
  }
}
