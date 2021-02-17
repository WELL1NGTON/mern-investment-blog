import { Segments, celebrate } from "celebrate";

import ChangeUserPasswordCommand from "@users/commands/ChangeUserPasswordCommand";
import CreateUserAndProfileCommand from "@users/commands/CreateUserAndProfileCommand";
import Joi from "joi";
import { Router } from "express";
import UpdateUserCommand from "@users/commands/UpdateUserCommand";
import UsersController from "@users/controllers/UsersController";
import { container } from "tsyringe";

const router = Router();

const usersController = new UsersController();

/**
 * This function comment is parsed by doctrine
 * @route GET /api
 * @group foo - Operations about user
 * @param {string} email.query.required - username or email - eg: user@domain
 * @param {string} password.query.required - user's password.
 * @returns {object} 200 - An array of user info
 * @returns {Error}  default - Unexpected error
 */
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
  usersController.list
);

router.get("/:id", usersController.get);

router.post("/", CreateUserAndProfileCommand.validator, usersController.create);

router.put("/", UpdateUserCommand.validator, usersController.update);

router.delete("/:id", usersController.delete);

router.put(
  "/:id/password",
  ChangeUserPasswordCommand.validator,
  usersController.update
);

router.post("/:id/enable", usersController.enable);

router.post("/:id/disable", usersController.disable);

export default router;
