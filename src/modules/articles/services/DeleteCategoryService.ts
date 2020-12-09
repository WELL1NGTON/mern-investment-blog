import Category from "@shared/models/category.model";
import AppError from "@shared/errors/AppError";
import StatusCodes from "http-status-codes";

const { NOT_FOUND, GONE } = StatusCodes;

interface IRequest {
  id: string;
}
interface IResponse {
  message: string;
}

class DeleteCategoryService {
  /**
   * @description Find (by id) and remove this category from the database.
   * @param {IRequest} { id }
   * @returns {*}  {Promise<IResponse>}
   * @memberof DeleteCategoryService
   */
  public async execute({ id }: IRequest): Promise<IResponse> {
    const category = await Category.findById(id).exec();

    if (!category) {
      throw new AppError("Categoria não encontrada.", GONE);
    }

    await Category.findByIdAndDelete(id);

    return { message: "Success!" };
  }
}

export default DeleteCategoryService;
