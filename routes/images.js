const multer = require("../middleware/multer");
const router = require("express").Router();
const auth = require("../middleware/auth");
const filehelper = require("../util/fileHelper");
const ImagePath = require("../models/imagePath.model");
const path = require("path");
const fs = require("fs");

// @route   GET /
// @desc    Get an array of all images
// @access  Private
router.route("/").get(auth, (req, res) => {
  const directoryPath = "./public/images/";
  const resolvedPath = path.resolve(directoryPath);
  fs.readdir(resolvedPath, (err, files) => {
    if (err) {
      console.log(err);
      return res.status(404).json("Couldn't read images directory");
    }
    res
      .status(200)
      .json({ files: files.filter((value) => value !== ".gitkeep") });
  });
});

// @route   POST add
// @desc    Save new image on file-system
// @access  Private
router.route("/add").post(auth, multer.single("image"), (req, res) => {
  if (!req.file) return res.status(400).json("Error on file upload.");
  const size = parseInt(req.body.size);
  filehelper
    .compressImage(req.file, size)
    .then((newPath) => {
      const newImagePath = new ImagePath({
        path: newPath,
        articles: [],
        tags: [],
        user: req.user.id,
      });
      return res.status(200).json({
        imgUrl: newPath,
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json("Error on file processing.");
    });
});

// @route   DELETE remove/:fileName
// @desc    Remove image from file-system
// @access  Private
router.route("/remove/:fileName").delete(auth, (req, res) => {
  console.log(req);
  const filePath = `./public/images/${req.params.fileName}`;
  const resolvedPath = path.resolve(filePath);
  console.log(resolvedPath);
  fs.unlink(resolvedPath, (err) => {
    if (err) {
      console.log(err);
      res.status(500).json("File not deleted.");
    }
    res.status(200).json(`file ${req.params.fileName} deleted.`);
  });
});

module.exports = router;
