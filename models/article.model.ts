import mongoose, { Schema, Document } from "mongoose";
import slugify from "slugify";

export interface IArticle extends Document {
  title: string;
  description: string;
  markdownArticle: string;
  date: Date;
  tags: Array<string>;
  author: string;
  previewImg: string;
  images: Array<string>;
  visibility: string;
  state: string;
  slug: string;
}

const ArticleSchema: Schema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
    },
    description: { type: String, default: "" },
    markdownArticle: { type: String, default: "" },
    date: { type: Date, default: Date.now },
    tags: { type: [String], default: [] },
    author: { type: String, required: true },
    previewImg: { type: String, default: "" },
    images: { type: [String], default: [] },
    visibility: {
      type: String,
      enum: ["ALL", "EDITORS", "USERS"],
      default: "ALL",
      required: true,
    },
    state: {
      type: String,
      enum: ["EDITING", "PUBLISHED", "DELETED"],
      default: "EDITING",
      required: true,
    },
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

ArticleSchema.pre<IArticle>("validate", function (next) {
  if (this.title) {
    this.slug = slugify(this.title, { lower: true, strict: true });
  }

  next();
});

export default mongoose.model<IArticle>("Article", ArticleSchema);
