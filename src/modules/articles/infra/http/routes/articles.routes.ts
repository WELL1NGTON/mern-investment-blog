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
 * @route   GET articles
 * @desc    Get visible and published articles
 * @access  Public
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
 * @route   GET articles/all
 * @desc    Get all articles without restrictions
 * @access  Private
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
 * @route   POST articles
 * @desc    Create a new article
 * @access  Private
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
 * @route   GET articles/:slug
 * @desc    Get article
 * @access  Public
 */
router.get("/:slug", articleController.show);

/**
 * @route   DELETE articles/:slug
 * @desc    Delete article
 * @access  Private
 */
router.delete("/:slug", ensureAuthenticated, articleController.delete);

/**
 * @route   POST articles/:slug
 * @desc    Update article
 * @access  Private
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
