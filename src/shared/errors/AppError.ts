/**
 * @swagger
 * definitions:
 *  Error:
 *    type: object
 *    properties:
 *      status:
 *        type: string
 *      message:
 *        type: string
 *    required:
 *      - status
 *      - message
 */

import { StatusCodes } from "http-status-codes";

/**
 * @typedef Error
 * @property {string} code.required
 */

class AppError extends Error {
  public readonly message: string;

  public readonly statusCode: number;

  constructor(message: string, statusCode = StatusCodes.BAD_REQUEST) {
    super(message);

    this.message = message;
    this.statusCode = statusCode;

    Error.captureStackTrace(this, this.constructor);
  }
}

export default AppError;
