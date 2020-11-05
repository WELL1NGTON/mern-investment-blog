import { Router, Request, Response } from "express";
import { ensureAuthenticated } from "@shared/middleware/ensureAuthenticated";
import ArticleController from "@modules/articles/infra/http/controllers/ArticleController";

const router = Router();

const articleController = new ArticleController();

// @route   GET articles
// @desc    Get visible and published articles
// @access  Public
router.route("/").get(articleController.list);

// @route   GET articles/all
// @desc    Get all articles without restrictions
// @access  Public
router.route("/all").get(ensureAuthenticated, articleController.listAll);

// @route   POST articles
// @desc    Create a new article
// @access  Private
router.route("/").post(ensureAuthenticated, articleController.create);

// @route   GET articles/:slug
// @desc    Get article
// @access  Public
router.route("/:slug").get(articleController.show);

// @route   DELETE articles/:slug
// @desc    Delete article
// @access  Private
router.route("/:slug").delete(ensureAuthenticated, articleController.delete);

// @route   POST articles/:slug
// @desc    Update article
// @access  Private
router.route("/:slug").post(articleController.update);

export default router;
