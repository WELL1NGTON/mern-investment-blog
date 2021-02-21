import CreateArticleCommand from "@articles/commands/CreateArticleCommand";
import UpdateArticleCommand from "@articles/commands/UpdateArticleCommand";
import { ICreateArticleService } from "@articles/services/articles/CreateArticleService";
import { IDeleteArticleService } from "@articles/services/articles/DeleteArticleService";
import { IGetArticleService } from "@articles/services/articles/GetArticleService";
import { IListArticlesService } from "@articles/services/articles/ListArticlesService";
import { IUpdateArticleService } from "@articles/services/articles/UpdateArticleService";
import TYPES from "@shared/constants/TYPES";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { inject } from "inversify";
import {
  BaseHttpController,
  controller,
  httpDelete,
  httpGet,
  httpPost,
  httpPut,
} from "inversify-express-utils";

@controller("/api/v1/articles")
class ArticlesController extends BaseHttpController {
  constructor(
    @inject(TYPES.ListArticlesService)
    private listArticlesService: IListArticlesService,
    @inject(TYPES.CreateArticleService)
    private createArticleService: ICreateArticleService,
    @inject(TYPES.DeleteArticleService)
    private deleteArticleService: IDeleteArticleService,
    @inject(TYPES.GetArticleService)
    private getArticleService: IGetArticleService,
    @inject(TYPES.UpdateArticleService)
    private updateArticleService: IUpdateArticleService
  ) {
    super();
  }

  @httpGet("/")
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

    const articles = await this.listArticlesService.execute({
      pageSize,
      pageIndex,
      ignorePageSize,
    });

    return response.status(StatusCodes.OK).json(articles);
  }

  @httpGet("/:id")
  public async get(request: Request, response: Response): Promise<Response> {
    const slug: string = request.params.slug;

    const article = await this.getArticleService.execute({ slug });

    const status = article ? StatusCodes.OK : StatusCodes.NO_CONTENT;

    return response.status(status).json(article);
  }

  @httpPost("/")
  public async create(request: Request, response: Response): Promise<Response> {
    const command = CreateArticleCommand.requestToCommand(request);

    // await this.createArticleService.execute(command);
    await this.createArticleService.execute(command);

    return response.status(StatusCodes.OK).send("Artigo criado com sucesso");
  }

  @httpPut("/:id")
  public async update(request: Request, response: Response): Promise<Response> {
    const command = UpdateArticleCommand.requestToCommand(request);

    await this.updateArticleService.execute(command);

    return response
      .status(StatusCodes.OK)
      .send("Artigo atualizado com sucesso");
  }

  @httpDelete("/:id")
  public async delete(request: Request, response: Response): Promise<Response> {
    const slug: string = request.params.slug;

    await this.deleteArticleService.execute({ slug });

    return response.status(StatusCodes.OK);
  }
}

export default ArticlesController;
