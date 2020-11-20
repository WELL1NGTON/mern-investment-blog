import mongoose, { Schema, Document } from "mongoose";

export interface ICategory extends Document {
  name: string;
  // posts_count: number;
  // last_entry: Date;
  visible: boolean;
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
      default: "#2874A6",
      match: /^#([a-fA-F0-9]{6}|[a-fA-F0-9]{3})$/,
    },
    // posts_count: { type: Number, required: true },
    // last_entry: { type: Date, default: Date.now },
    visible: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<ICategory>("Category", CategorySchema);
