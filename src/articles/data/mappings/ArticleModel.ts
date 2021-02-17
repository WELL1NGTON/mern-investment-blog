import ArticleState, { articleStates } from "@shared/types/ArticleState";
import CategoryModel, { ICategoryMongooseDocument } from "./CategoryModel";
import Visibility, { visibilities } from "@shared/types/Visibility";
import mongoose, { Document, ObjectId, Schema } from "mongoose";

import Article from "@articles/models/Article";
import { IProfileMongooseDocument } from "@users/data/mappings/ProfileModel";
import Profile from "@users/models/Profile";
import mongoosePaginate from "mongoose-paginate-v2";
// import mongoose_fuzzy_searching from 'mongoose-fuzzy-searching';
import slugify from "slugify";
import slugifyOptions from "@articles/configurations/slugifyOptions";

// #region Mongoose-Document-Interface
// TODO: Find a better way to use interfaces for mapping
// ! Need to be changed if Article.ts changes... Not the best implmentation, but it will do for now
export interface IArticleMongooseDocument extends Document {
  slug: string;
  title: string;
  category?: mongoose.Types.ObjectId;
  author?: mongoose.Types.ObjectId;
  description: string;
  markdownArticle: string;
  date: Date;
  visibility: Visibility;
  state: ArticleState;
  tags: string[];
  previewImg?: string;
}
// #endregion Mongoose-Document-Interface

//#region Defining-Schema
const ArticleSchema: Schema = new Schema(
  {
    slug: {
      type: String,
      required: true,
      unique: true,
    },
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
    previewImg: { type: String },
    category: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: false,
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: "Profile",
      required: false,
    },
    visibility: {
      type: String,
      enum: visibilities,
      default: "ALL",
      required: true,
    },
    state: {
      type: String,
      enum: articleStates,
      default: "EDITING",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);
//#endregion Defining-Schema

//#region Mongoose-Plugins-and-Mongoose-Middlewares
// ArticleSchema.plugin(mongoose_fuzzy_searching, {
//   fields: [
//     { name: "title", weight: 2 },
//     { name: "description", weight: 1 },
//   ],
// });

ArticleSchema.plugin(mongoosePaginate);

ArticleSchema.pre<IArticleMongooseDocument>("validate", function (next) {
  if (this.title) {
    this.slug = slugify(this.title, slugifyOptions);
    this.tags = this.tags?.map((tag: string) => tag.toUpperCase());
  }

  next();
});

ArticleSchema.method("toArticle", function () {
  const obj = this.toObject();

  obj.id = obj._id;
  delete obj._id;

  return obj as Article;
});

// ArticleSchema.virtual('id').get(function () {
//   return this._id.toHexString();
// });
//#endregion Mongoose-Plugins-and-Mongoose-Middlewares

const ArticleModel = mongoose.model<IArticleMongooseDocument>(
  "Article",
  ArticleSchema
);

export default ArticleModel;

//  as MongooseFuzzyModel<IArticleMongooseDocument>; //Algum bug por algum motivo?????
