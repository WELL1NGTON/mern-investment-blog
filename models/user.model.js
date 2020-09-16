const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
    },
    name: { type: String, required: true },
    password: { type: String, required: true },
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

const User = mongoose.model("User", userSchema);

module.exports = User;
