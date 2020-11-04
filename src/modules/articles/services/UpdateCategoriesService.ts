import Category from "@shared/models/category.model";
import async from "async";

interface IRequest {
  newTags: string[];
  oldTags: string[];
}
interface IResponse {
  msg: string;
  updatedTags: Array<{ tag: string; ammount: number }>;
}

class UpdateCategoriesService {
  public async execute({ newTags, oldTags }: IRequest): Promise<IResponse> {
    const tagsToUpdate: Array<{ tag: string; ammount: number }> = [];

    newTags.forEach((newTag) => {
      if (!oldTags.includes(newTag))
        tagsToUpdate.push({
          tag: newTag,
          ammount: 1,
        });
    });

    oldTags.forEach((oldTag) => {
      if (!newTags.includes(oldTag))
        tagsToUpdate.push({
          tag: oldTag,
          ammount: -1,
        });
    });

    await async.each(tagsToUpdate, (tagToUpdate) => {
      const name = tagToUpdate.tag;

      Category.findOne({ name })
        .then((category) => {
          if (category)
            Category.findOneAndUpdate(
              { name },
              { $inc: { posts_count: tagToUpdate.ammount } }
            ).catch((err) => console.log("Error: " + err));
          else {
            const newCategory = new Category({
              name: name,
              posts_count: tagToUpdate.ammount,
            });

            newCategory.save().catch((err) => console.log("Error: " + err));
            console.log(name);
          }
        })
        .catch((err) => console.log("Error: " + err));
    });

    return { msg: "success", updatedTags: tagsToUpdate };
  }
}

export default UpdateCategoriesService;
