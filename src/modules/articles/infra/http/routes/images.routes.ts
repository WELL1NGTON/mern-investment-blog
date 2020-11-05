import multer from "@shared/middleware/multer";
import express, { Request, Response } from "express";
import { ensureAuthenticated } from "@shared/middleware/ensureAuthenticated";
import ImagesController from "@modules/articles/infra/http/controllers/ImagesController";

const router = express.Router();
const imagesController = new ImagesController();

// @route   GET images/
// @desc    Get an array of all images
// @access  Private
router.route("/").get(ensureAuthenticated, imagesController.list);

// @route   POST images/
// @desc    Save new image on file-system
// @access  Private
router
  .route("/")
  .post(multer.single("image"), ensureAuthenticated, imagesController.upload);

// @route   DELETE images/:fileName
// @desc    Remove image from file-system
// @access  Private
router.route("/:fileName").delete(ensureAuthenticated, imagesController.delete);

export default router;
