import { Joi, Segments, celebrate } from "celebrate";

import ArticlesController from "@articles/controllers/ArticlesController";
import CreateArticleCommand from "@articles/commands/CreateArticleCommand";
import { Router } from "express";
import UpdateArticleCommand from "@articles/commands/UpdateArticleCommand";
import { container } from "tsyringe";
import ensureAuthenticated from "@auth/middleware/ensureAuthenticated";

const router = Router();

const articlesController = new ArticlesController();

router.get(
  "/",
  ensureAuthenticated,
  // TODO: descobrir o porque de erros quando utilizando segments query
  // celebrate({
  //   [Segments.QUERY]: {
  //     // pageSize: Joi.optional(),
  //     // currentPage: Joi.number().integer().greater(0).optional().default(1),
  //     // orderDirection: Joi.string().custom((direction) =>
  //     //   ["ASC", "DESC"].includes(direction)
  //     // ),
  //     // orderBy: Joi.string().optional(),
  //     // title: Joi.string().optional(),
  //     // category: Joi.string().optional(),
  //     // description: Joi.string().optional(),
  //   },
  // }),
  articlesController.list
);

router.get("/:slug", articlesController.get);

router.post("/", CreateArticleCommand.validator, articlesController.create);

router.put("/", UpdateArticleCommand.validator, articlesController.update);

router.delete("/:slug", articlesController.delete);

export default router;
