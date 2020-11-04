import express, { Request, Response } from "express";

import ForgotPasswordController from "@modules/users/infra/http/controllers/ForgotPasswordController";

const router = express.Router();

const forgotPassword = new ForgotPasswordController();

// @route   delete auth/forgot
// @desc    Logout user
// @access  Private
router.route("/:token").post((req: Request, res: Response) => {
  forgotPassword.reset(req, res);
});

export default router;
