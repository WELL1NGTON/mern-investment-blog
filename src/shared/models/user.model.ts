/**
 * @swagger
 *  components:
 *    schemas:
 *      User:
 *        type: object
 *        required:
 *          - name
 *          - email
 *          - password
 *          - role
 *        properties:
 *          name:
 *            type: string
 *          email:
 *            type: string
 *            format: email
 *            description: Email for the user, needs to be unique.
 *          password:
 *            type: string
 *            format: password
 *          role:
 *            type: string
 *            description: ADMIN | WRITER
 *        example:
 *           name: User Example
 *           email: fake@email.com
 *           password: 123456
 *           role: ADMIN
 */

import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  email: string;
  name: string;
  password: string;
  role: string;
  image?: string;
  info?: string;
}

const UserSchema: Schema = new Schema(
  {
    email: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      unique: true,
    },
    name: { type: String, required: true },
    password: { type: String, required: true },
    role: { type: String, required: true },
    resetPasswordToken: { type: String, required: false, unique: true },
    image: String,
    info: String
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IUser>("User", UserSchema);
