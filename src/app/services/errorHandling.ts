import express, { NextFunction, Request, Response } from "express";

import AppError from "@shared/errors/AppError";
import { CelebrateError } from "celebrate";
import { StatusCodes } from "http-status-codes";
import logger from "@app/services/Logger";

const errorHandling = (
  err: Error,
  request: Request,
  response: Response,
  _: NextFunction
) => {
  logger.err(err, true);

  if (err instanceof AppError) {
    return response.status(err.statusCode).json({
      status: "Error",
      message: err.message,
    });
  }

  if (err instanceof CelebrateError) {
    let errMessage = "";
    err.details.forEach((value) => {
      errMessage += value.message + "\n";
    });
    return response.status(StatusCodes.BAD_REQUEST).json({
      status: "Error",
      message: errMessage,
    });
  }

  return response.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
    status: "Error",
    message: "Internal server error",
    // message: err.message,
  });
};

export default errorHandling;
