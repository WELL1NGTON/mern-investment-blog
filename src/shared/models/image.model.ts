import mongoose, { Schema, Document } from "mongoose";
import slugify from "slugify";

export interface IImage extends Document {
  slug: string;
  name: string;
  tags: string[];
  binData: { data: Buffer; contentType: string };
  uploadedBy: Schema.Types.ObjectId;
}

const ImageSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
    },
    tags: { type: [String], default: [] },
    binData: { data: Buffer, contentType: String },
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

ImageSchema.pre<IImage>("validate", function (next) {
  if (this.name) {
    this.slug = slugify(this.name, { lower: true });
    this.tags = this.tags.map((tag: string) => tag.toUpperCase());
  }

  next();
});

export default mongoose.model<IImage>("Image", ImageSchema);
