const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const imagePathSchema = new Schema(
  {
    path: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
    },
    articles: { type: [String], required: true },
    tags: { type: [String], required: true },
    user: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

const ImagePath = mongoose.model("ImagePath", imagePathSchema);

module.exports = ImagePath;
