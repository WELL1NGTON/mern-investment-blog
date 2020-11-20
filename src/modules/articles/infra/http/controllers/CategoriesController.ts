import { Request, Response } from "express";
import ListCategoriesService from "@modules/articles/services/ListCategoriesService";
import CreateCategoryService from "@modules/articles/services/CreateCategoryService";
import DeleteCategoryService from "@modules/articles/services/DeleteCategoryService";
import UpdateCategoryService from "@modules/articles/services/UpdateCategoryService";
import StatusCodes from "http-status-codes";

const { CREATED, OK, NO_CONTENT } = StatusCodes;

export default class CategoriesController {
  public async list(request: Request, response: Response): Promise<Response> {
    const listCategories = new ListCategoriesService();

    const categoriesResponse = await listCategories.execute({});

    return response.status(OK).json(categoriesResponse);
  }

  public async create(request: Request, response: Response): Promise<Response> {
    const { name, visible, color } = request.body;

    const createCategory = new CreateCategoryService();

    const categoryResponse = await createCategory.execute({
      name,
      visible,
      color,
    });

    return response.status(CREATED).json(categoryResponse);
  }

  public async delete(request: Request, response: Response): Promise<Response> {
    const { id } = request.body;

    const deleteCategory = new DeleteCategoryService();

    const categoryResponse = await deleteCategory.execute({ id });

    return response.status(NO_CONTENT).json(categoryResponse);
  }

  public async update(request: Request, response: Response): Promise<Response> {
    const { name, visible, color } = request.body;
    const id = request.params.id;

    const updateCategory = new UpdateCategoryService();

    const categoryResponse = await updateCategory.execute({
      id,
      name,
      visible,
      color,
    });

    return response.status(CREATED).json(categoryResponse);
  }
}
