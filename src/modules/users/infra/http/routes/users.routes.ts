import express from "express";
import { ensureAuthenticated } from "@shared/middleware/ensureAuthenticated";
import UsersController from "@modules/users/infra/http/controllers/UsersController";
import ProfileController from "@modules/users/infra/http/controllers/ProfileController";

const router = express.Router();

const usersController = new UsersController();
const profileController = new ProfileController();

// @route   POST users
// @desc    Register new user
// @access  Private
router.route("/").post(ensureAuthenticated, (req, res) => {
  if (req.body.user.role !== "ADMIN")
    return res.status(401).json({ msg: "Usuário não autorizado." });

  usersController.create(req, res);
});

// @route   POST users
// @desc    Update user
// @access  Private
router.route("/:email").post(ensureAuthenticated, (req, res) => {
  profileController.update(req, res);
});

module.exports = router;
