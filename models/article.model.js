const mongoose = require("mongoose");
// const marked = require('marked');
const slugify = require("slugify");
const Schema = mongoose.Schema;

const articleSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
    },
    description: { type: String, required: true },
    markdownArticle: { type: String, required: true },
    date: { type: Date, required: false },
    tags: { type: [String], required: true },
    author: { type: String, required: true },
    slug: {
      type: String,
      required: true,
      unique: true,
    },
  },
  {
    timestamps: true,
  }
);

articleSchema.pre("validate", function (next) {
  if (this.title) {
    this.slug = slugify(this.title, { lower: true, strict: true });
  }

  next();
});

const Article = mongoose.model("Article", articleSchema);

module.exports = Article;
