/**
 * @swagger
 * tags:
 *   name: Articles
 *   description: Articles management
 */

import { Router, Request, Response } from "express";
import { ensureAuthenticated } from "@shared/middleware/ensureAuthenticated";
import ArticleController from "@modules/articles/infra/http/controllers/ArticleController";
import { celebrate, Modes, Segments, Joi, CelebrateOptions } from "celebrate";
import { ValidationErrorFunction } from "joi";
import Article, { IArticle } from "@shared/models/article.model";
import AppError from "@shared/errors/AppError";

const router = Router();

const articleController = new ArticleController();

/**
 * @swagger
 *  /articles:
 *    get:
 *      summary: Get visible and published articles
 *      description: Get visible and published articles
 *      produces:
 *        - application/json
 *      tags: [Articles]
 *      responses:
 *        200:
 *          description: Show articles.
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  message:
 *                    type: string
 *                  articles:
 *                    type: array
 *                    items:
 *                      $ref: '#/components/schemas/Article'
 */
router.get(
  "/",
  celebrate(
    {
      [Segments.QUERY]: {
        search: Joi.string().optional(),
        slug: Joi.string().optional(),
        tags: Joi.alternatives(Joi.string(), Joi.array()).optional(),
        date: Joi.date().optional(), //Don't work with inequality symbols. ex.: date>yyyy-MM-dd
        author: Joi.string().optional(),
      },
    },
    { abortEarly: false }
    // { mode: Modes.FULL } as CelebrateOptions
  ),
  articleController.list
);

/**
 * @swagger
 *  /articles/all:
 *    get:
 *      summary: Get all articles without restrictions
 *      description: Get all articles without restrictions
 *      produces:
 *        - application/json
 *      tags: [Articles]
 *      responses:
 *        200:
 *          description: Show articles.
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  message:
 *                    type: string
 *                  articles:
 *                    type: array
 *                    items:
 *                      $ref: '#/components/schemas/Article'
 */
router.get(
  "/all",
  celebrate(
    {
      // [Segments.COOKIES]: {
      //   "access-token": Joi.string().required().error(),
      //   "refresh-token": Joi.string().required(),
      // },
      [Segments.QUERY]: {
        search: Joi.string().optional(),
        slug: Joi.string().optional(),
        tags: Joi.alternatives(Joi.string(), Joi.array()).optional(),
        date: Joi.date().optional(), //Don't work with inequality symbols. ex.: date>yyyy-MM-dd
        author: Joi.string().optional(),
        visibility: Joi.string().optional(),
        state: Joi.string().optional(),
      },
    },
    { abortEarly: false }
    // { mode: Modes.FULL } as CelebrateOptions
  ),
  ensureAuthenticated,
  articleController.listAll
);

/**
 * @swagger
 *  /articles:
 *    post:
 *      summary: Create a new article
 *      description: Create a new article
 *      produces:
 *        - application/json
 *      tags: [Articles]
 *      parameters:
 *        - name: body
 *          in: body
 *          schema:
 *            $ref: '#/definitions/Article'
 *            type: object
 *            properties:
 *              title:
 *                type: string
 *              description:
 *                type: string
 *              author:
 *                type: string
 *              markdownArticle:
 *                type: string
 *              date:
 *                type: string
 *              tags:
 *                type: string
 *              previewImg:
 *                type: string
 *              visibility:
 *                type: string
 *                enum:
 *                  - ALL
 *                  - EDITORS
 *                  - USERS
 *              state:
 *                type: string
 *                enum:
 *                  - EDITING
 *                  - PUBLISHED
 *                  - DELETED
 *              category:
 *                type: string
 *            required:
 *              - title
 *              - author
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Article'
 *      responses:
 *        200:
 *          description: Artigo criado com sucesso.
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  message:
 *                    type: string
 *                  articles:
 *                    $ref: '#/components/schemas/Article'
 */
router.post(
  "/",
  celebrate(
    {
      [Segments.BODY]: {
        title: Joi.string().min(3).required(),
        author: Joi.string().required(),
        description: Joi.string().default(""),
        markdownArticle: Joi.string().default(""),
        date: Joi.date().default(Date.now),
        // tags: Joi.string(),
        tags: Joi.array().items(Joi.string()).default([]),
        previewImg: Joi.string().uri().optional(),
        visibility: Joi.string()
          .default("EDITORS")
          .pattern(/^ALL$|^EDITORS$|^USERS$/),
        state: Joi.string()
          .default("EDITING")
          .pattern(/^EDITING$|^PUBLISHED$|^DELETED$/),
        category: Joi.string().default(""),
      },
    },
    { abortEarly: false }
    // { mode: Modes.FULL } as CelebrateOptions
  ),
  ensureAuthenticated,
  articleController.create
);

/**
 * @swagger
 *  /articles/:slug:
 *    get:
 *      summary: Get article
 *      description: Get article
 *      produces:
 *        - application/json
 *      tags: [Articles]
 *      responses:
 *        200:
 *          description: Show articles.
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  message:
 *                    type: string
 *                  article:
 *                    $ref: '#/components/schemas/Article'
 *        404:
 *          description: Article not found
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/definitions/Error'
 */
router.get("/:slug", articleController.show);

/**
 * @swagger
 *  /articles/:slug:
 *    delete:
 *      summary: Delete article
 *      description: Delete article
 *      produces:
 *        - application/json
 *      tags: [Articles]
 *      responses:
 *        204:
 *          description: Artigo excluido com sucesso.
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  message:
 *                    type: string
 *        404:
 *          description: Article not found
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/definitions/Error'
 */
router.delete("/:slug", ensureAuthenticated, articleController.delete);

/**
 * @swagger
 *  /articles/:slug:
 *    post:
 *      summary: Update article
 *      description: Update article
 *      produces:
 *        - application/json
 *      tags: [Articles]
 *      parameters:
 *        - name: body
 *          in: body
 *          schema:
 *            $ref: '#/definitions/Article'
 *            type: object
 *            properties:
 *              title:
 *                type: string
 *              description:
 *                type: string
 *              author:
 *                type: string
 *              markdownArticle:
 *                type: string
 *              date:
 *                type: string
 *              tags:
 *                type: string
 *              previewImg:
 *                type: string
 *              visibility:
 *                type: string
 *                enum:
 *                  - ALL
 *                  - EDITORS
 *                  - USERS
 *              state:
 *                type: string
 *                enum:
 *                  - EDITING
 *                  - PUBLISHED
 *                  - DELETED
 *              category:
 *                type: string
 *            required:
 *              - title
 *              - author
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Article'
 *      responses:
 *        200:
 *          description: Artigo atualizado com sucesso.
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  message:
 *                    type: string
 *                  article:
 *                    $ref: '#/components/schemas/Article'
 *        404:
 *          description: Article not found
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/definitions/Error'
 */
router.post(
  "/:slug",
  celebrate(
    {
      [Segments.BODY]: {
        title: Joi.string().min(3).required(),
        author: Joi.string().required(),
        description: Joi.string().optional(),
        markdownArticle: Joi.string().optional(),
        date: Joi.date().optional(),
        // tags: Joi.string(),
        tags: Joi.array().items(Joi.string()).optional(),
        previewImg: Joi.string().uri().optional(),
        visibility: Joi.string()
          .default("EDITORS")
          .pattern(/^ALL$|^EDITORS$|^USERS$/)
          .optional(),
        state: Joi.string()
          .default("EDITING")
          .pattern(/^EDITING$|^PUBLISHED$|^DELETED$/)
          .optional(),
        category: Joi.string().optional(),
      },
    },
    { abortEarly: false }
    // { mode: Modes.FULL } as CelebrateOptions
  ),
  ensureAuthenticated,
  articleController.update
);

export default router;
