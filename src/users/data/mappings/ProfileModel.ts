import mongoose, { Document, Schema } from 'mongoose';

// TODO: Find a better way to use interfaces for mapping
// ! Need to be changed if Article.ts changes... Not the best implmentation, but it will do for now
export interface IProfileMongooseDocument extends Document {
  name: string;
  about: string;
  profileImage: string;
  contact: [string, string][];
}

// const ContactSchema = new Schema({ body: String, date: Date }, { noId: true });

const ProfileSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
    },

    about: {
      type: String,
      trim: true,
    },

    profileImage: {
      type: String,
      trim: true,
    },

    contact: {
      type: [[String, String]],
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IProfileMongooseDocument>(
  'Profile',
  ProfileSchema
);
