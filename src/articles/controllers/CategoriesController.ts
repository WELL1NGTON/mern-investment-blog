import { Request, Response } from "express";

import CreateCategoryCommand from "@articles/commands/CreateCategoryCommand";
import CreateCategoryService from "@articles/services/categories/CreateCategoryService";
import DeleteCategoryService from "@articles/services/categories/DeleteCategoryService";
import GetCategoryService from "@articles/services/categories/GetCategoryService";
import ListCategoriesService from "@articles/services/categories/ListCategoriesService";
import { StatusCodes } from "http-status-codes";
import UpdateCategoryCommand from "@articles/commands/UpdateCategoryCommand";
import UpdateCategoryService from "@articles/services/categories/UpdateCategoryService";
import { container } from "tsyringe";

class CategoriesController {
  public async list(request: Request, response: Response): Promise<Response> {
    const orderBy = request.query.orderBy
      ? {
          orderBy: request.query.orderBy as string,
          orderDirection: (request.query.orderBy as string) ?? "ASC",
        }
      : undefined;

    const pageSize = request.query.pageSize
      ? parseInt(request.query.pageSize as string)
      : undefined;
    const currentPage = request.query.currentPage
      ? parseInt(request.query.currentPage as string)
      : undefined;

    const categories = await container
      .resolve(ListCategoriesService)
      .execute({ pageSize, currentPage });

    return response.status(StatusCodes.OK).json(categories);
  }

  public async get(request: Request, response: Response): Promise<Response> {
    const id: string = request.params.id;

    const category = await container
      .resolve(GetCategoryService)
      .execute({ id });

    const status = category ? StatusCodes.OK : StatusCodes.NO_CONTENT;

    return response.status(status).json(category);
  }

  public async create(request: Request, response: Response): Promise<Response> {
    const command = CreateCategoryCommand.requestToCommand(request);

    await container.resolve(CreateCategoryService).execute(command);

    return response.status(StatusCodes.OK).send("Artigo criado com sucesso");
  }

  public async update(request: Request, response: Response): Promise<Response> {
    const command = UpdateCategoryCommand.requestToCommand(request);

    await container.resolve(UpdateCategoryService).execute(command);

    return response
      .status(StatusCodes.OK)
      .send("Artigo atualizado com sucesso");
  }

  public async delete(request: Request, response: Response): Promise<Response> {
    const id: string = request.params.id;

    await container.resolve(DeleteCategoryService).execute({ id });

    return response.status(StatusCodes.OK);
  }
}

export default CategoriesController;
