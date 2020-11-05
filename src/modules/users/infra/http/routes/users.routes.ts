import express from "express";
import { ensureAuthenticated } from "@shared/middleware/ensureAuthenticated";
import UsersController from "@modules/users/infra/http/controllers/UsersController";
import ProfileController from "@modules/users/infra/http/controllers/ProfileController";
import AppError from "@shared/errors/AppError";

const router = express.Router();

const usersController = new UsersController();
const profileController = new ProfileController();

// @route   POST users
// @desc    Register new user
// @access  Private
router.route("/").post(ensureAuthenticated, (req, res) => {
  if (req.body.user.role !== "ADMIN"){
    throw new AppError("Usuário não autorizado.", 400);
  }

  usersController.create(req, res);
});

// @route   POST users
// @desc    Update user
// @access  Private
router.route("/:email").post(ensureAuthenticated, profileController.update);

export default router;
