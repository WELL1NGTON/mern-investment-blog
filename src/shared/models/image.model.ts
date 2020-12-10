/**
 * @swagger
 *  components:
 *    schemas:
 *      Image:
 *        type: object
 *        required:
 *          - slug
 *          - name
 *          - tags
 *          - url
 *          - binData
 *          - uploadedBy
 *        properties:
 *          slug:
 *            type: string
 *            description: String without special characters created from image name.
 *          name:
 *            type: string
 *            description: Image name need to be unique.
 *          tags:
 *            type: string[]
 *            description: Array of strings to facilitate image search for reuse.
 *          url:
 *            type: string
 *          binData:
 *            type: obejct
 *            properties:
 *              data:
 *                type: Buffer
 *              contentType:
 *                type: string
 *          uploadedBy:
 *            type: ObjectId
 *        example:
 *            slug: Image-Example.jpg
 *            name: Image Example
 *            tags: ['TESTE TAG 1', 'TESTE TAG 2']
 *            binData:
 *              data: Binary("image_in_bynary")
 *              contentType: "image/jpg"
 *            uploadedBy: 5f5bba6398a2377048ccf6b2
 */

import mongoose, { Schema, Document } from "mongoose";
import slugify from "slugify";

export interface IImage extends Document {
  slug: string;
  name: string;
  tags: string[];
  url: string;
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
      unique: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
    },
    tags: { type: [String], default: [] },
    binData: { data: Buffer, contentType: String },
    url: {
      type: String,
      required: true,
      unique: true,
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

ImageSchema.pre<IImage>("validate", function (next) {
  if (this.name) {
    this.slug = slugify(this.name, { lower: true });
    this.url =
      "https://herokuinvestmentblog.herokuapp.com/api/images/" + this.slug;
    this.tags = this.tags.map((tag: string) => tag.toUpperCase());
  }

  next();
});

export default mongoose.model<IImage>("Image", ImageSchema);
