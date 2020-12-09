/**
 * @swagger
 * tags:
 *   name: Reset
 *   description: User management teste
 */

import express, { Request, Response } from "express";

import ForgotPasswordController from "@modules/users/infra/http/controllers/ForgotPasswordController";

const router = express.Router();

const forgotPassword = new ForgotPasswordController();

// @route   delete auth/forgot
// @desc    Logout user
// @access  Private
router.route("/:token").post(forgotPassword.reset);

export default router;
