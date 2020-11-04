import express, { Request, Response } from "express";
import { ensureAuthenticated } from "@shared/middleware/ensureAuthenticated";
import ArticleController from "@modules/articles/infra/http/controllers/ArticleController";

const router = express.Router();

const articleController = new ArticleController();

// @route   GET articles
// @desc    Get visible and published articles
// @access  Public
router.route("/").get((req: Request, res: Response) => {
  articleController.list(req, res);
});

// @route   GET articles/all
// @desc    Get all articles without restrictions
// @access  Public
router.route("/all").get(ensureAuthenticated, (req: Request, res: Response) => {
  articleController.listAll(req, res);
});

// @route   POST articles
// @desc    Create a new article
// @access  Private
router.route("/").post(ensureAuthenticated, (req: Request, res: Response) => {
  articleController.create(req, res);
});

// @route   GET articles/:slug
// @desc    Get article
// @access  Public
router.route("/:slug").get((req: Request, res: Response) => {
  articleController.show(req, res);
});

// @route   DELETE articles/:slug
// @desc    Delete article
// @access  Private
router
  .route("/:slug")
  .delete(ensureAuthenticated, (req: Request, res: Response) => {
    articleController.delete(req, res);
  });

// @route   POST articles/:slug
// @desc    Update article
// @access  Private
router.route("/:slug").post((req: Request, res: Response) => {
  articleController.update(req, res);
});

export default router;
