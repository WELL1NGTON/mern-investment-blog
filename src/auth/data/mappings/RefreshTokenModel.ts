import mongoose, { Document, Schema } from "mongoose";

import Email from "@shared/valueObjects/Email";

// TODO: Find a better way to use interfaces for mapping
// ! Need to be changed if Article.ts changes... Not the best implmentation, but it will do for now
export interface IRefreshTokenMongooseDocument extends Document {
  email: string;
  token: string;
  expirationDate: Date;
}
// const ContactSchema = new Schema({ body: String, date: Date }, { noId: true });

const RefreshTokenSchema: Schema = new Schema(
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

    token: {
      type: String,
      required: true,
    },

    expirationDate: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IRefreshTokenMongooseDocument>(
  "RefreshToken",
  RefreshTokenSchema
);
