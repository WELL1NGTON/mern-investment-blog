/**
 * @swagger
 *  components:
 *    schemas:
 *      RefreshToken:
 *        type: object
 *        required:
 *          - user_id
 *          - token
 *        properties:
 *          user_id:
 *            type: string
 *            description: User that "owns" this token
 *          token:
 *            type: string
 *        example:
 *           user_id: 5f5bba6398a2377048ccf6b2
 *           token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoiNWY1ZmU2MDM1MzFjM2ZiNjczZGFkOWVkIiwiaWF0IjoxNjAyMDgwMDM1LCJleHAiOjE2MDIwODAwNTB9.NJ-G_dtGUlI93-S_c-9aBi4S_9gZlFlcgZWE62O6prU
 */

import mongoose, { Schema, Document } from "mongoose";

export interface IRefreshToken extends Document {
  user_id: string;
  token: string;
}

const RefreshTokenSchema: Schema = new Schema(
  {
    user_id: {
      type: String,
      required: true,
    },
    token: { type: String, required: true, unique: true },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IRefreshToken>(
  "RefreshToken",
  RefreshTokenSchema
);
