import { Router, Request, Response } from "express";
import { ensureAuthenticated } from "@shared/middleware/ensureAuthenticated";
import ArticleController from "@modules/articles/infra/http/controllers/ArticleController";

const router = Router();

const articleController = new ArticleController();

/**
 * @route   GET articles
 * @desc    Get visible and published articles
 * @access  Public
 */
router.get("/", articleController.list);

/**
 * @route   GET articles/all
 * @desc    Get all articles without restrictions
 * @access  Private
 */
router.get("/all", ensureAuthenticated, articleController.listAll);

/**
 * @route   POST articles
 * @desc    Create a new article
 * @access  Private
 */
router.post("/", ensureAuthenticated, articleController.create);

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
router.post("/:slug", ensureAuthenticated, articleController.update);

export default router;
