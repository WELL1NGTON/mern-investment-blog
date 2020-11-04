import express, { Request, Response } from "express";
import { ensureAuthenticated } from "@shared/middleware/ensureAuthenticated";

import SessionController from "@modules/users/infra/http/controllers/SessionController";
import UsersController from "@modules/users/infra/http/controllers/UsersController";
import ProfileController from "@modules/users/infra/http/controllers/ProfileController";

import ForgotPasswordController from "../controllers/ForgotPasswordController";

const router = express.Router();

const sessionController = new SessionController();
const profileController = new ProfileController();
const forgotPasswordController = new ForgotPasswordController();

// @route   POST auth/
// @desc    Auth user (login)
// @access  Public
router.route("/").post((req: Request, res: Response) => {
  sessionController.login(req, res);
});

// @route   get auth/
// @desc    Return current user
// @access  Private
router.route("/").get(ensureAuthenticated, (req: Request, res: Response) => {
  profileController.show(req, res);
});

// @route   delete auth/
// @desc    Logout user
// @access  Private
router.route("/").delete(ensureAuthenticated, (req: Request, res: Response) => {
  sessionController.logout(req, res);
});

// @route   POST auth/forgot
// @desc    Logout user
// @access  Private
router.route("/forgot").post((req: Request, res: Response) => {
  forgotPasswordController.sendToken(req, res);
});

module.exports = router;
