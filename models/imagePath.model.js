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
    articles: { type: [String], required: false },
    user: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

// userSchema.pre("validate", function (next) {
// if (this.title) {
//   this.slug = slugify(this.title, { lower: true, strict: true });
// }

//   next();
// });

const ImagePath = mongoose.model("ImagePath", imagePathSchema);

module.exports = ImagePath;
