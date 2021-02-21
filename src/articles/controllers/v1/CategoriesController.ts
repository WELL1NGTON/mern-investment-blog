import CreateCategoryCommand from "@articles/commands/CreateCategoryCommand";
import UpdateCategoryCommand from "@articles/commands/UpdateCategoryCommand";
import CreateCategoryService, {
  ICreateCategoryService,
} from "@articles/services/categories/CreateCategoryService";
import { IDeleteCategoryService } from "@articles/services/categories/DeleteCategoryService";
import { IGetCategoryService } from "@articles/services/categories/GetCategoryService";
import { IListCategoriesService } from "@articles/services/categories/ListCategoriesService";
import { IUpdateCategoryService } from "@articles/services/categories/UpdateCategoryService";
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

@controller("/api/v1/categories")
class CategoriesController extends BaseHttpController {
  constructor(
    @inject(TYPES.CreateCategoryService)
    private createCategoryService: ICreateCategoryService,
    @inject(TYPES.DeleteCategoryService)
    private deleteCategoryService: IDeleteCategoryService,
    @inject(TYPES.GetCategoryService)
    private getCategoryService: IGetCategoryService,
    @inject(TYPES.ListCategoriesService)
    private listCategoriesService: IListCategoriesService,
    @inject(TYPES.UpdateCategoryService)
    private updateCategoryService: IUpdateCategoryService
  ) {
    super();
  }

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

  @httpGet("/:id")
  public async get(request: Request, response: Response): Promise<Response> {
    const id: string = request.params.id;

    const category = await this.getCategoryService.execute({ id });

    const status = category ? StatusCodes.OK : StatusCodes.NO_CONTENT;

    return response.status(status).json(category);
  }

  @httpPost("/")
  public async create(request: Request, response: Response): Promise<Response> {
    const command = CreateCategoryCommand.requestToCommand(request);

    await this.createCategoryService.execute(command);

    return response.status(StatusCodes.OK).send("Artigo criado com sucesso");
  }

  @httpPut("/:id")
  public async update(request: Request, response: Response): Promise<Response> {
    const command = UpdateCategoryCommand.requestToCommand(request);

    await this.updateCategoryService.execute(command);

    return response
      .status(StatusCodes.OK)
      .send("Artigo atualizado com sucesso");
  }

  @httpDelete("/:id")
  public async delete(request: Request, response: Response): Promise<Response> {
    const id: string = request.params.id;

    await this.deleteCategoryService.execute({ id });

    return response.status(StatusCodes.OK);
  }
}

export default CategoriesController;
