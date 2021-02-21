import ProfilesController from "@users/controllers/v1/ProfilesController";
import { Router } from "express";
import UpdateCategoryCommand from "@articles/commands/UpdateCategoryCommand";

const router = Router();

const profilesController = new ProfilesController();

router.get(
  "/",
  // celebrate({
  //   [Segments.QUERY]: {
  //     // pageSize: Joi.optional(),
  //     // currentPage: Joi.number().integer().greater(0).optional().default(1),
  //     // orderDirection: Joi.string().custom((direction) =>
  //     //   ["ASC", "DESC"].includes(direction)
  //     // ),
  //     // orderBy: Joi.string().optional(),
  //     // name: Joi.string().optional(),
  //   },
  // }),
  profilesController.list
);

router.get("/:id", profilesController.get);

// router.post(
//   "/",
//   container.resolve(CreateCategoryCommand).validator,
//   profilesController.create
// );

router.put("/", UpdateCategoryCommand.validator, profilesController.update);

// router.delete(
//   "/:id",
//    profilesController.delete
// );

export default router;
