const router = require('express').Router();
let Article = require('../models/article.model');

router.route('/').get((req, res) => {
  Article.find()
    .sort({ createdAt: 'desc' })
    .then((articles) => res.json(articles))
    .catch((err) => res.status(400).json('Error: ' + err));
});

router.route('/add').post((req, res) => {
  const title = req.body.title;
  const description = req.body.description;
  const markdownArticle = req.body.markdownArticle;
  const date = Date.parse(req.body.date);
  const tags = req.body.tags;
  const author = req.body.author;

  const newArticle = new Article({ title, description, markdownArticle, date, tags, author });

  newArticle
    .save()
    .then(() => res.json('Article added!'))
    .catch((err) => res.status(400).json('Error: ' + err));
});

router.route('/:slug').get((req, res) => {
  Article.findOne({ slug: req.params.slug })
    .then((article) => res.json(article))
    .catch((err) => res.status(400).json('Error: ' + err));
});

router.route('/:slug').delete((req, res) => {
  Article.findOneAndDelete({ slug: req.params.slug })
    .then(() => res.json('Article deleted.'))
    .catch((err) => res.status(400).json('Error: ' + err));
});

router.route('/update/:slug').post((req, res) => {
  Article.findOne({ slug: req.params.slug })
    .then((article) => {
      article.title = req.body.title;
      article.description = req.body.description;
      article.markdownArticle = req.body.markdownArticle;
      article.date = Date.parse(req.body.date);
      article.tags = req.body.tags;
      article.author = req.body.author;

      article
        .save()
        .then(() => res.json('Article updated!'))
        .catch((err) => res.status(400).json('Error: ' + err));
    })
    .catch((err) => res.status(400).json('Error: ' + err));
});

module.exports = router;
