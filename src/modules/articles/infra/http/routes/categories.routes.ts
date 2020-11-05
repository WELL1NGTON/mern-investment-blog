import express, { Request, Response } from "express";
import Category from "@shared/models/category.model";
import CategoriesController from "@modules/articles/infra/http/controllers/CategoriesController";

const router = express.Router();
const categoriesController = new CategoriesController();

// @route   GET categories
// @desc    Get all categories
// @access  Public
router.route("/").get(categoriesController.list);

export default router;
