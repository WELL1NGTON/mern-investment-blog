import multer from "@shared/middleware/multer";
import express from "express";
import { ensureAuthenticated } from "@shared/middleware/ensureAuthenticated";
import ImagesController from "@modules/articles/infra/http/controllers/ImagesController";
import { celebrate, Segments, Joi } from "celebrate";

const router = express.Router();
const imagesController = new ImagesController();

/**
 * @route   GET images/
 * @desc    Get an array of all images
 * @access  Private
 */
router.get(
  "/",
  celebrate(
    {
      // [Segments.COOKIES]: {
      //   "access-token": Joi.string().required().error(),
      //   "refresh-token": Joi.string().required(),
      // },
      [Segments.QUERY]: {
        name: Joi.string().optional(),
        slug: Joi.string().optional(),
        tags: Joi.alternatives(Joi.string(), Joi.array()).optional(),
        date: Joi.date().optional(), //Don't work with inequality symbols. ex.: date>yyyy-MM-dd
        uploadedBy: Joi.string().optional(),
      },
    },
    { abortEarly: false }
    // { mode: Modes.FULL } as CelebrateOptions
  ),
  ensureAuthenticated,
  imagesController.list
);

router.get("/:slug", ensureAuthenticated, imagesController.show);

/**
 * @route   POST images/
 * @desc    Save new image on file-system
 * @access  Private
 */
router.post(
  "/",
  multer.single("image"),
  ensureAuthenticated,
  imagesController.upload
);

/**
 * @route   DELETE images/:fileName
 * @desc    Remove image from file-system
 * @access  Private
 */
router.delete("/:slug", ensureAuthenticated, imagesController.delete);

export default router;
