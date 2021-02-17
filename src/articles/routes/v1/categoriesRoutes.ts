import { Segments, celebrate } from "celebrate";

import CategoriesController from "@articles/controllers/CategoriesController";
import CreateCategoryCommand from "@articles/commands/CreateCategoryCommand";
import Joi from "joi";
import { Router } from "express";
import UpdateCategoryCommand from "@articles/commands/UpdateCategoryCommand";
import { container } from "tsyringe";

const router = Router();

const categoriesController = new CategoriesController();

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
  categoriesController.list
);

router.get("/:slug", categoriesController.get);

router.post("/", CreateCategoryCommand.validator, categoriesController.create);

router.put("/", UpdateCategoryCommand.validator, categoriesController.update);

router.delete("/:slug", categoriesController.delete);

export default router;
