import mongoose, { Document, ObjectId, Schema } from "mongoose";

// #region Mongoose-Document-Interface
export interface IImagePathMongooseDocument extends Document {
  slug: string;
  name: string;
  tags: string[];
  url: string;
  bucket: string;
  firebaseFileName: string;
  firebaseStorageDownloadTokens: string;
  uploadedBy: mongoose.Types.ObjectId;
}
// #endregion Mongoose-Document-Interface

//#region Defining-Schema
const ImagePathSchema: Schema = new Schema(
  {
    slug: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
    },
    tags: { type: [String], default: [] },
    url: { type: String, required: true },
    bucket: { type: String, required: true },
    firebaseFileName: { type: String, required: true },
    firebaseStorageDownloadTokens: { type: String, required: true },
    uploadedBy: {
      type: Schema.Types.ObjectId,
      ref: "Profile",
      required: false,
    },
  },
  {
    timestamps: true,
  }
);
//#endregion Defining-Schema

const ImagePathModel = mongoose.model<IImagePathMongooseDocument>(
  "ImagePath",
  ImagePathSchema
);

export default ImagePathModel;
