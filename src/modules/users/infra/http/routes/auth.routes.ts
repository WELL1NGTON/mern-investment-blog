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
router.route("/").post(sessionController.login);

// @route   get auth/
// @desc    Return current user
// @access  Private
router.route("/").get(ensureAuthenticated, profileController.show);

// @route   delete auth/
// @desc    Logout user
// @access  Private
router.route("/").delete(ensureAuthenticated, sessionController.logout);

// @route   POST auth/forgot
// @desc    Logout user
// @access  Private
router.route("/forgot").post(forgotPasswordController.sendToken);

export default router;
