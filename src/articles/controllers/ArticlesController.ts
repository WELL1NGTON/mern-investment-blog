import { Request, Response } from "express";

import CreateArticleCommand from "@articles/commands/CreateArticleCommand";
import CreateArticleService from "@articles/services/articles/CreateArticleService";
import DeleteArticleService from "@articles/services/articles/DeleteArticleService";
import GetArticleService from "@articles/services/articles/GetArticleService";
import ListArticlesService from "@articles/services/articles/ListArticlesService";
import { StatusCodes } from "http-status-codes";
import UpdateArticleCommand from "@articles/commands/UpdateArticleCommand";
import UpdateArticleService from "@articles/services/articles/UpdateArticleService";
import { container } from "tsyringe";

class ArticlesController {
  public async list(request: Request, response: Response): Promise<Response> {
    const ignorePageSize =
      request.query.ignorePageSize === "true" ? true : false;

    // const orderBy = request.query.orderBy
    //   ? {
    //       orderBy: request.query.orderBy as string,
    //       orderDirection: (request.query.orderBy as string) ?? "ASC",
    //     }
    //   : undefined;

    const pageSize = request.query.pageSize
      ? parseInt(request.query.pageSize as string)
      : undefined;
    const pageIndex = request.query.pageIndex
      ? parseInt(request.query.pageIndex as string)
      : undefined;

    const articles = await container
      .resolve(ListArticlesService)
      .execute({ pageSize, pageIndex, ignorePageSize });

    return response.status(StatusCodes.OK).json(articles);
  }

  public async get(request: Request, response: Response): Promise<Response> {
    const slug: string = request.params.slug;

    const article = await container
      .resolve(GetArticleService)
      .execute({ slug });

    const status = article ? StatusCodes.OK : StatusCodes.NO_CONTENT;

    return response.status(status).json(article);
  }

  public async create(request: Request, response: Response): Promise<Response> {
    const command = CreateArticleCommand.requestToCommand(request);

    await container.resolve(CreateArticleService).execute(command);

    return response.status(StatusCodes.OK).send("Artigo criado com sucesso");
  }

  public async update(request: Request, response: Response): Promise<Response> {
    const command = UpdateArticleCommand.requestToCommand(request);

    await container.resolve(UpdateArticleService).execute(command);

    return response
      .status(StatusCodes.OK)
      .send("Artigo atualizado com sucesso");
  }

  public async delete(request: Request, response: Response): Promise<Response> {
    const slug: string = request.params.slug;

    await container.resolve(DeleteArticleService).execute({ slug });

    return response.status(StatusCodes.OK);
  }
}

export default ArticlesController;
