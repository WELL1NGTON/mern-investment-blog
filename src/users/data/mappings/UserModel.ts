import { defaultRole, roles } from "@shared/types/Role";
import mongoose, { Document, Schema } from "mongoose";

import Email from "@shared/valueObjects/Email";

// TODO: Find a better way to use interfaces for mapping
// ! Need to be changed if Article.ts changes... Not the best implmentation, but it will do for now
export interface IUserMongooseDocument extends Document {
  email: string;
  password: string;
  role: string;
  isActive: boolean;
}

// const ContactSchema = new Schema({ body: String, date: Date }, { noId: true });

const UserSchema: Schema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      validate: {
        validator: Email.isValid,
        message: (props: { value: any }) =>
          `${props.value} não é um email válido`,
      },
    },

    password: {
      type: String,
      required: true,
      // TODO: validate:
    },

    role: {
      type: String,
      required: true,
      enum: roles,
      default: defaultRole,
    },

    isActive: {
      type: Boolean,
      required: true,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IUserMongooseDocument>("User", UserSchema);
