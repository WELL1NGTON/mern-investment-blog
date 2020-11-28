import express, { Request, Response } from "express";
import Category from "@shared/models/category.model";
import CategoriesController from "@modules/articles/infra/http/controllers/CategoriesController";
import { ensureAuthenticated } from "@shared/middleware/ensureAuthenticated";

const router = express.Router();
const categoriesController = new CategoriesController();

/**
 * @route   GET categories
 * @desc    Get all categories
 * @access  Public
 */
router.get("/", categoriesController.list);

/**
 * @route   POST categories
 * @desc    Create new category
 * @access  Private
 */
router.post("/", ensureAuthenticated, categoriesController.create);

export default router;
