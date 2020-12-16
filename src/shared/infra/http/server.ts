import express, { Request, Response, NextFunction } from "express";
import "express-async-errors";
import BodyParser from "body-parser";
import cors from "cors";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import router from "./routes";
import AppError from "@shared/errors/AppError";
import path from "path";

const nodemailer = require("nodemailer");
// const rateLimiterMiddleware = require("./middleware/rateLimiter");

//environment variables
import "dotenv/config";
import { CelebrateError } from "celebrate";
import { StatusCodes } from "http-status-codes";

//express server
const app = express();
const port = process.env.PORT || 5000;

//middleware
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000", //frontend
    credentials: true,
  })
);
app.use(express.json());

// app.use(express.static("public")); //folder public so user can receive the images

// app.use(rateLimiterMiddleware);

// const uri = process.env.ATLAS_URI;
const uri = process.env.MONGO_URI;
if (uri) {
  mongoose.connect(uri, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  });
  const connection = mongoose.connection;
  connection.once("open", () => {
    console.log("MongoDB database connection established successfully");
  });
}
app.use("/api", router);

if (process.env.NODE_ENV === "production") {
  // Set static folder
  app.use(express.static("client/build"));

  app.get("*", (request: Request, response: Response) => {
    console.log(__dirname);
    response.sendFile(
      path.resolve(
        __dirname + "../../../../../",
        "client",
        "build",
        "index.html"
      )
    );
  });
}

//Serve static assets if in production
app.use((err: Error, request: Request, response: Response, _: NextFunction) => {
  console.log(err);

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
});

//start listening
app.listen(port, () => {
  console.log(`server is running on port:  ${port}`);
});
