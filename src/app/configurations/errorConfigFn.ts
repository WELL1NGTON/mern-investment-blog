import { Application, NextFunction, Request, Response } from "express";

import AppError from "@shared/errors/AppError";
import { CelebrateError } from "celebrate";
import { StatusCodes } from "http-status-codes";
import logger from "@app/services/Logger";

/************************************************************************************
 *                                  Handle Errors
 ***********************************************************************************/

// Print API errors
// server.setConfig((app) => app.use(errorHandling));
// app.use(errorHandling);

function errorConfigFn(app: Application): void {
  app.use(
    (
      err: Error,
      request: Request,
      response: Response,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      _: NextFunction
    ) => {
      logger.err(err, true);

      console.log(err);
      console.log(typeof err);
      console.log(err);
      console.log(err.stack);

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
    }
  );
}

export default errorConfigFn;
