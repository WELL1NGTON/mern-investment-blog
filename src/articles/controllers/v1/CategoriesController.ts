import CreateCategoryCommand from "@articles/commands/CreateCategoryCommand";
import UpdateCategoryCommand from "@articles/commands/UpdateCategoryCommand";
import CreateCategoryService from "@articles/services/categories/CreateCategoryService";
import DeleteCategoryService from "@articles/services/categories/DeleteCategoryService";
import GetCategoryService from "@articles/services/categories/GetCategoryService";
import ListCategoriesService from "@articles/services/categories/ListCategoriesService";
import UpdateCategoryService from "@articles/services/categories/UpdateCategoryService";
import EnsureAuthenticated from "@auth/middleware/EnsureAuthenticated";
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
import {
  ApiOperationDelete,
  ApiOperationGet,
  ApiOperationPost,
  ApiOperationPut,
  ApiPath,
  SwaggerDefinitionConstant,
} from "swagger-express-ts";

@ApiPath({
  path: "/api/v1/categories",
  name: "Categories",
})
@controller("/api/v1/categories")
class CategoriesController extends BaseHttpController {
  constructor(
    @inject(TYPES.CreateCategoryService)
    private createCategoryService: CreateCategoryService,
    @inject(TYPES.DeleteCategoryService)
    private deleteCategoryService: DeleteCategoryService,
    @inject(TYPES.GetCategoryService)
    private getCategoryService: GetCategoryService,
    @inject(TYPES.ListCategoriesService)
    private listCategoriesService: ListCategoriesService,
    @inject(TYPES.UpdateCategoryService)
    private updateCategoryService: UpdateCategoryService
  ) {
    super();
  }

  @ApiOperationGet({
    summary: "Get a list of Categories",
    description: "Get Categories as PagedResult",
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
    // const orderBy = request.query.orderBy
    //   ? {
    //       orderBy: request.query.orderBy as string,
    //       orderDirection: (request.query.orderBy as string) ?? "ASC",
    //     }
    //   : undefined;

    const pageSize = request.query.pageSize
      ? parseInt(request.query.pageSize as string)
      : undefined;
    const currentPage = request.query.currentPage
      ? parseInt(request.query.currentPage as string)
      : undefined;

    const categories = await this.listCategoriesService.execute({
      pageSize,
      currentPage,
    });

    return response.status(StatusCodes.OK).json(categories);
  }

  @ApiOperationGet({
    summary: "Get an existing Category",
    description: "Get Category from it's id",
    path: "/{id}",
    parameters: { path: { ["id"]: { name: "id" } } },
    responses: {
      [StatusCodes.OK]: {
        description: "Success",
        model: "Category",
      },
      [StatusCodes.NOT_FOUND]: {
        description: "Not Found",
        model: "AppError",
      },
    },
  })
  @httpGet("/:id")
  public async get(request: Request, response: Response): Promise<Response> {
    const id: string = request.params.id;

    const category = await this.getCategoryService.execute({ id });

    const status = category ? StatusCodes.OK : StatusCodes.NOT_FOUND;

    return response.status(status).json(category);
  }

  @ApiOperationPost({
    summary: "Create new Category",
    description: "Create new Category",
    parameters: {
      body: {
        description: "New category",
        required: true,
        model: "CreateUpdateCategory",
      },
    },
    responses: {
      [StatusCodes.OK]: {
        description: "Success",
      },
    },
    security: { basicAuth: [] },
  })
  @httpPost("/", TYPES.EnsureAuthenticated)
  public async create(request: Request, response: Response): Promise<Response> {
    const command = CreateCategoryCommand.requestToCommand(request);

    await this.createCategoryService.execute(command);

    return response.status(StatusCodes.OK).send("Artigo criado com sucesso");
  }

  @ApiOperationPut({
    summary: "Update a Category",
    description: "Update an existing Category, based on it's id",
    path: "/{id}",
    parameters: {
      path: { ["id"]: { name: "id" } },
      body: {
        description: "Updated category",
        required: true,
        model: "CreateUpdateCategory",
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
    },
    security: { basicAuth: [] },
  })
  @httpPut("/:id", TYPES.EnsureAuthenticated)
  public async update(request: Request, response: Response): Promise<Response> {
    const command = UpdateCategoryCommand.requestToCommand(request);

    await this.updateCategoryService.execute(command);

    return response
      .status(StatusCodes.OK)
      .send("Artigo atualizado com sucesso");
  }

  @ApiOperationDelete({
    summary: "Remove a Category",
    description: "Remove an existing Category, based on it's id",
    path: "/{id}",
    parameters: {
      path: { ["id"]: { name: "id" } },
    },
    responses: {
      [StatusCodes.OK]: {
        description: "Success",
      },
      [StatusCodes.NOT_FOUND]: {
        description: "Not Found",
        model: "AppError",
      },
    },
    security: { basicAuth: [] },
  })
  @httpDelete("/:id", TYPES.EnsureAuthenticated)
  public async delete(request: Request, response: Response): Promise<Response> {
    const id: string = request.params.id;

    await this.deleteCategoryService.execute({ id });

    return response.status(StatusCodes.OK);
  }
}

export default CategoriesController;
