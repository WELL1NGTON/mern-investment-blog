import CreateArticleCommand from "@articles/commands/CreateArticleCommand";
import UpdateArticleCommand from "@articles/commands/UpdateArticleCommand";
import { ICreateArticleService } from "@articles/services/articles/CreateArticleService";
import { IDeleteArticleService } from "@articles/services/articles/DeleteArticleService";
import { IGetArticleService } from "@articles/services/articles/GetArticleService";
import { IListArticlesService } from "@articles/services/articles/ListArticlesService";
import { IUpdateArticleService } from "@articles/services/articles/UpdateArticleService";
import AuthService from "@auth/services/AuthService";
import TYPES from "@shared/constants/TYPES";
import AppError from "@shared/errors/AppError";
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
import {
  ApiOperationDelete,
  ApiOperationGet,
  ApiOperationPost,
  ApiOperationPut,
  ApiPath,
  SwaggerDefinitionConstant,
} from "swagger-express-ts";

const authService = inject(TYPES.AuthService);

@ApiPath({
  path: "/api/v1/articles",
  name: "Articles Controller",
})
@controller("/api/v1/articles")
class ArticlesController extends BaseHttpController {
  @authService private readonly _authService: AuthService;

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

  @ApiOperationGet({
    summary: "Get a list of Articles",
    description: "Get Articles as PagedResult",
    parameters: {
      query: {
        pageSize: {
          description:
            "Maximum ammount of items returned per page (greater than 0)",
          type: SwaggerDefinitionConstant.NUMBER,
          default: 10,
        },
        pageIndex: {
          description:
            "Index of the page that will have items returned (greater than 0)",
          type: SwaggerDefinitionConstant.NUMBER,
          default: 1,
        },
        ignorePageSize: {
          description:
            "Ignore the other pagination limitations and return all items in one single page",
          type: SwaggerDefinitionConstant.BOOLEAN,
          default: (false as unknown) as number, // Gambiarra lol
        },
      },
    },
    responses: {
      [StatusCodes.OK]: {
        description: "Success",
        model: "PagedResult",
      },
    },
  })
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

  @ApiOperationGet({
    summary: "Get an existing Article",
    description: "Get Article from it's slug",
    path: "/{slug}",
    parameters: { path: { ["slug"]: { name: "slug" } } },
    responses: {
      [StatusCodes.OK]: {
        description: "Success",
        model: "Article",
      },
      [StatusCodes.NOT_FOUND]: {
        description: "Not Found",
        model: "AppError",
      },
    },
  })
  @httpGet("/:slug")
  public async get(request: Request, response: Response): Promise<Response> {
    const slug: string = request.params.slug;

    const article = await this.getArticleService.execute({ slug });

    const status = article ? StatusCodes.OK : StatusCodes.NO_CONTENT;

    return response.status(status).json(article);
  }

  @ApiOperationPost({
    summary: "Create new Article",
    description: "Create new Article",
    parameters: {
      body: {
        description: "New Article",
        required: true,
        model: "CreateUpdateArticle",
      },
    },
    responses: {
      [StatusCodes.OK]: {
        description: "Success",
      },
      [StatusCodes.UNAUTHORIZED]: {
        description: "Unauthorized",
        model: "AppError",
      },
    },
    security: { ["Bearer"]: [] },
  })
  @httpPost("/")
  public async create(request: Request, response: Response): Promise<Response> {
    await this._authService.ensureAuthenticated(this.httpContext);
    await this._authService.ensureHasPermission(
      this.httpContext,
      "CREATE_ARTICLE"
    );

    const command = CreateArticleCommand.requestToCommand(request);

    // await this.createArticleService.execute(command);
    await this.createArticleService.execute(command);

    return response.status(StatusCodes.OK).send("Artigo criado com sucesso");
  }

  @ApiOperationPut({
    summary: "Update an Article",
    description: "Update an existing Article, based on it's slug",
    path: "/{slug}",
    parameters: {
      path: { ["slug"]: { name: "slug" } },
      body: {
        description: "Updated Article",
        required: true,
        model: "CreateUpdateArticle",
      },
    },
    responses: {
      [StatusCodes.OK]: {
        description: "Success",
      },
      [StatusCodes.NOT_FOUND]: {
        description: "Not Found",
        model: "AppError",
      },
      [StatusCodes.UNAUTHORIZED]: {
        description: "Unauthorized",
        model: "AppError",
      },
    },
    security: { ["Bearer"]: [] },
  })
  @httpPut("/:slug")
  public async update(request: Request, response: Response): Promise<Response> {
    await this._authService.ensureAuthenticated(this.httpContext);
    await this._authService.ensureHasPermission(
      this.httpContext,
      "EDIT_ARTICLE"
    );

    const command = UpdateArticleCommand.requestToCommand(request);

    await this.updateArticleService.execute(command);

    return response
      .status(StatusCodes.OK)
      .send("Artigo atualizado com sucesso");
  }

  @ApiOperationDelete({
    summary: "Remove an Article",
    description: "Remove an existing Article, based on it's slug",
    path: "/{slug}",
    parameters: {
      path: { ["slug"]: { name: "slug" } },
    },
    responses: {
      [StatusCodes.OK]: {
        description: "Success",
      },
      [StatusCodes.NOT_FOUND]: {
        description: "Not Found",
        model: "AppError",
      },
      [StatusCodes.UNAUTHORIZED]: {
        description: "Unauthorized",
        model: "AppError",
      },
    },
    security: { ["Bearer"]: [] },
  })
  @httpDelete("/:slug")
  public async delete(request: Request, response: Response): Promise<Response> {
    await this._authService.ensureAuthenticated(this.httpContext);
    await this._authService.ensureHasPermission(
      this.httpContext,
      "DELETE_ARTICLE"
    );

    const slug: string = request.params.slug;

    await this.deleteArticleService.execute({ slug });

    return response.status(StatusCodes.OK);
  }
}

export default ArticlesController;
