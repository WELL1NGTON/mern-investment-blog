import AuthController from "@auth/controllers/AuthController";
import LoginCommand from "@auth/commands/LoginCommand";
import { Router } from "express";
import { container } from "tsyringe";
import ensureAuthenticated from "@auth/middleware/ensureAuthenticated";

const router = Router();

const authController = new AuthController();

/**
 * @swagger
 *
 * /api/v1/auth/login:
 *   post:
 *      summary: Authenticate user
 *      description: Authenticate user and put the tokens on cookies
 *      produces:
 *       - application/json
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                email:
 *                  type: string
 *                password:
 *                  type: string
 *      responses:
 *        200:
 *          description: User authenticated
 *          content:
 *            application/json:
 *              schema:
 *               type: object
 *               properties:
 *                 accessToken:
 *                   type: string
 *                 refreshToken:
 *                   type: string
 */
router.post("/login", LoginCommand.validator, authController.login);

router.post("/logout", ensureAuthenticated, authController.logout);

export default router;
