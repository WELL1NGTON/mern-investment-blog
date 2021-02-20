import Visibility, { visibilities } from "@shared/types/Visibility";
import mongoose, { Document, Schema } from "mongoose";

// TODO: Find a better way to use interfaces for mapping
// ! Need to be changed if Article.ts changes... Not the best implmentation, but it will do for now
export interface ICategoryMongooseDocument extends Document {
  name: string;
  visibility: Visibility;
  color: string;
}

const CategorySchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: 3,
    },

    color: {
      type: String,
      default: "#000000",
      match: /^#[a-fA-F0-9]{6}$/,
    },

    visibility: {
      type: String,
      default: "ALL",
      enum: visibilities,
      // validate: matchVilibilities,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<ICategoryMongooseDocument>(
  "Category",
  CategorySchema
);
