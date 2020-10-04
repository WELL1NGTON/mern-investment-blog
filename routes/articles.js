const router = require("express").Router();
const Article = require("../models/article.model");
const Category = require("../models/category.model");
const auth = require("../middleware/auth");
var async = require("async");

// @route   GET articles
// @desc    Get all articles
// @access  Public
router.route("/").get((req, res) => {
  Article.find()
    .find({ $and: [{ state: "PUBLISHED" }, { visibility: "ALL" }] }) //Return Published and Visible to all
    .sort({ createdAt: "desc" })
    .limit(20)
    .select("-markdownArticle")
    .then((articles) => res.json(articles))
    .catch((err) => res.status(400).json("Error: " + err));
});

// @route   POST articles
// @desc    Add new article
// @access  Private
router.route("/add").post(auth, (req, res) => {
  const {
    title,
    description,
    markdownArticle,
    author,
    state,
    visibility,
  } = req.body;
  const date = Date.parse(req.body.date);
  const tags = req.body.tags.map((tag) => tag.toUpperCase());

  //const imgUrl = req.file.filename;

  const newArticle = new Article({
    title,
    description,
    markdownArticle,
    date,
    tags,
    author,
    state,
    visibility,
    //previewImg: imgUrl
  });

  newArticle
    .save()
    .then(() => {
      updateCategories(tags);

      res.json("Article added!");
    })
    .catch((err) => res.status(400).json("Error: " + err));
});

// @route   GET articles/:slug
// @desc    Get article
// @access  Public
router.route("/:slug").get((req, res) => {
  Article.findOne({ slug: req.params.slug })
    .then((article) => res.json(article))
    .catch((err) => res.status(400).json("Error: " + err));
});

// @route   DELETE articles/:slug
// @desc    Delete article
// @access  Private
router.route("/:slug").delete(auth, (req, res) => {
  Article.findOneAndDelete({ slug: req.params.slug })
    .then((article) => {
      // console.log(article);
      updateCategories([], article.tags);
      res.json("Article deleted.");
    })
    .catch((err) => res.status(400).json("Error: " + err));
});

// @route   POST articles/update/:slug
// @desc    Update article
// @access  Private
router.route("/update/:slug").post((req, res) => {
  Article.findOne({ slug: req.params.slug })
    .then((article) => {
      oldTags = article.tags;
      newTags = req.body.tags.map((tag) => tag.toUpperCase());

      article.title = req.body.title;
      article.description = req.body.description;
      article.markdownArticle = req.body.markdownArticle;
      article.date = Date.parse(req.body.date);
      article.tags = req.body.tags.map((tag) => tag.toUpperCase());
      article.author = req.body.author;

      article
        .save()
        .then(() => {
          updateCategories(newTags, oldTags);
          res.json("Article updated!");
        })
        .catch((err) => res.status(400).json("Error: " + err));
    })
    .catch((err) => res.status(400).json("Error: " + err));
});

module.exports = router;

async function updateCategories(newTags, oldTags = []) {
  tagsToUpdate = [];

  newTags.forEach((newTag) => {
    if (!oldTags.includes(newTag))
      tagsToUpdate.push({
        tag: newTag,
        ammount: 1,
      });
  });

  oldTags.forEach((oldTag) => {
    if (!newTags.includes(oldTag))
      tagsToUpdate.push({
        tag: oldTag,
        ammount: -1,
      });
  });

  async.each(tagsToUpdate, (tagToUpdate, callback) => {
    const name = tagToUpdate.tag;

    Category.findOne({ name })
      .then((category) => {
        if (category)
          Category.findOneAndUpdate(
            { name },
            { $inc: { posts_count: tagToUpdate.ammount } }
          ).catch((err) => console.log("Error: " + err));
        else {
          const newCategory = new Category({
            name: name,
            posts_count: tagToUpdate.ammount,
          });

          newCategory.save().catch((err) => console.log("Error: " + err));
        }
      })
      .catch((err) => console.log("Error: " + err));
  });
}
