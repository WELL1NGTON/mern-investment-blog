/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management teste
 */

import express from "express";
import { ensureAuthenticated } from "@shared/middleware/ensureAuthenticated";
import UsersController from "@modules/users/infra/http/controllers/UsersController";
import ProfileController from "@modules/users/infra/http/controllers/ProfileController";
import AppError from "@shared/errors/AppError";
import { StatusCodes } from "http-status-codes";

const router = express.Router();

const usersController = new UsersController();
const profileController = new ProfileController();

/**
 * @swagger
 *  /users:
 *    post:
 *      summary: Register new user
 *      description: Creates a user
 *      produces:
 *        - application/json
 *      tags: [Users]
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
 *                name:
 *                  type: string
 *                role:
 *                  type: string
 *                  enum: [WRITER, ADMIN,]
 *      responses:
 *        201:
 *          description: User was created with success.
 *          content:
 *            application/json:
 *               schema:
 *                type: object
 *                properties:
 *                  message:
 *                    type: string
 *                  user:
 *                     $ref: '#/components/schemas/User'
 *        401:
 *          description: New user was not created because the current authenticated user isn't the admin.
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/definitions/Error'
 */
router.route("/").post(ensureAuthenticated, (req, res) => {
  if (req.body.user.role !== "ADMIN") {
    throw new AppError("Usuário não autorizado.", StatusCodes.UNAUTHORIZED);
  }

  usersController.create(req, res);
});

/**
 * @swagger
 *  /users/{userId}:
 *    post:
 *      summary: Update user
 *      tags: [Users]
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/User'
 *      responses:
 *        200:
 *          description: User updated
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#components/schemas/User'
 *        400:
 *          description: Usuário não existe
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/definitions/Error'
 *        500:
 *          description: Falha ao alterar a senha de usuário
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/definitions/Error'
 */
router.route("/:email").post(ensureAuthenticated, profileController.update);

export default router;
