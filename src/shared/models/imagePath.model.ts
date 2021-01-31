import mongoose, { Document, Schema } from "mongoose";

import slugify from "slugify";

export interface IImagePath extends Document {
  slug: string;
  name: string;
  tags: string[];
  url: string;
  bucket: string;
  firebaseFileName: string;
  firebaseStorageDownloadTokens: string;
  uploadedBy: Schema.Types.ObjectId;
}

const ImagePathSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      unique: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
    },
    tags: { type: [String], default: [] },
    url: {
      type: String,
      required: true,
      unique: true,
    },
    bucket: {
      type: String,
      required: true,
      unique: false,
    },
    firebaseFileName: {
      type: String,
      required: true,
      unique: false,
    },
    firebaseStorageDownloadTokens: {
      type: String,
      required: true,
      unique: false,
    },
    uploadedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

ImagePathSchema.pre<IImagePath>("validate", function (next) {
  if (this.name) {
    this.slug = slugify(this.name, { lower: true });
    this.tags = this.tags.map((tag: string) => tag.toUpperCase());
  }

  next();
});

export default mongoose.model<IImagePath>("ImagePath", ImagePathSchema);
