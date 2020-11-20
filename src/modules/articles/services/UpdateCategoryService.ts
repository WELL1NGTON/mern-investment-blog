import Category, { ICategory } from "@shared/models/category.model";
import AppError from "@shared/errors/AppError";
import StatusCodes from "http-status-codes";
// import async from "async";

const { NOT_FOUND, INTERNAL_SERVER_ERROR } = StatusCodes;

interface IRequest {
  id: string;
  name: string;
  color?: string;
  visible?: boolean;
}
interface IResponse {
  msg: string;
  category: ICategory;
}

class UpdateCategoryService {
  /**
   * @description Update an existing category
   * @param {IRequest} {
   *     id,
   *     name,
   *     color,
   *     visible,
   *   }
   * @returns {*}  {Promise<IResponse>}
   * @memberof UpdateCategoryService
   */
  public async execute({
    id,
    name,
    color,
    visible,
  }: IRequest): Promise<IResponse> {
    const category = await Category.findById(id).exec();

    if (!category) {
      throw new AppError("Artigo não encontrado.", NOT_FOUND);
    }
    const updatedCategory = (
      await Category.findByIdAndUpdate(
        id,
        {
          name,
          color,
          visible,
        },
        { upsert: true, new: true }
      )
    ).value;

    if (!updatedCategory) {
      throw new AppError("Falha ao alterar o artigo.", INTERNAL_SERVER_ERROR);
    }

    const response: IResponse = {
      msg: "Artigo alterado com sucesso!",
      category: updatedCategory,
    };

    return response;

    // const tagsToUpdate: Array<{ tag: string; ammount: number }> = [];
    // newTags.forEach((newTag) => {
    //   if (!oldTags.includes(newTag))
    //     tagsToUpdate.push({
    //       tag: newTag,
    //       ammount: 1,
    //     });
    // });
    // oldTags.forEach((oldTag) => {
    //   if (!newTags.includes(oldTag))
    //     tagsToUpdate.push({
    //       tag: oldTag,
    //       ammount: -1,
    //     });
    // });
    // await async.each(tagsToUpdate, (tagToUpdate) => {
    //   const name = tagToUpdate.tag;
    //   Category.findOne({ name })
    //     .then((category) => {
    //       if (category)
    //         Category.findOneAndUpdate(
    //           { name },
    //           { $inc: { posts_count: tagToUpdate.ammount } }
    //         ).catch((err) => console.log("Error: " + err));
    //       else {
    //         const newCategory = new Category({
    //           name: name,
    //           posts_count: tagToUpdate.ammount,
    //         });
    //         newCategory.save().catch((err) => console.log("Error: " + err));
    //         console.log(name);
    //       }
    //     })
    //     .catch((err) => console.log("Error: " + err));
    // });
    // return { msg: "success", updatedTags: tagsToUpdate };
  }
}

export default UpdateCategoryService;
