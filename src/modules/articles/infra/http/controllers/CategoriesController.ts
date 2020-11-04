import { Request, Response } from "express";

import ListCategoriesService from "@modules/articles/services/ListCategoriesService";

export default class CategoriesController {
  public async list(request: Request, response: Response): Promise<Response> {
    const listCategories = new ListCategoriesService();

    const categories = await listCategories.execute({});

    return response.status(200).json(categories);
  }
}
