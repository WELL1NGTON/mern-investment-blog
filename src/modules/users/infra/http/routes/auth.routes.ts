/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: User management teste
 */

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

/**
 * @swagger
 *  /auth/:
 *    post:
 *      summary: User login
 *      tags: [Users]
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            email: string
 *            password: string
 *      responses:
 *        "200":
 *          description: A user schema
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/User'
 */
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
