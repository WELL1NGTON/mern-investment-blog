import "@app/container";
import "express-async-errors";

import express, { Request, Response } from "express";

import BaseRouter from "./routes";
import cookieParser from "cookie-parser";
import { cookieProps } from "./configurations/cookieProps";
import errorHandling from "./services/errorHandling";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
import startMongooseAndListen from "./services/startMongooseAndListen";
import swaggerJSDocOptions from "./configurations/swaggerJSDocOptions";
import swaggerUi from "swagger-ui-express";

const app = express();

/************************************************************************************
 *                              Set basic express settings
 ***********************************************************************************/

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser(cookieProps.secret));

// Show routes called in console during development
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Security
if (process.env.NODE_ENV === "production") {
  app.use(helmet());
}

// Add APIs
app.use("/api", BaseRouter);

/************************************************************************************
 *                              Handle Errors
 ***********************************************************************************/

// Print API errors
app.use(errorHandling);

/************************************************************************************
 *                              Connect to Database
 ***********************************************************************************/

startMongooseAndListen();

/************************************************************************************
 *                              Serve front-end content
 ***********************************************************************************/

//Serve static assets if in production
if (process.env.NODE_ENV === "production") {
  // Set static folder
  app.use(express.static("client/build"));

  app.get("*", (request: Request, response: Response) => {
    console.log(__dirname);
    response.sendFile(
      path.resolve(__dirname + "./", "client", "build", "index.html")
    );
  });
}

/************************************************************************************
 *                              Use Swagger
 ***********************************************************************************/

if (process.env.NODE_ENV === "development") {
  app.use("/swagger", swaggerUi.serve, swaggerUi.setup(swaggerJSDocOptions));
}

/************************************************************************************
 *                              Export Server
 ***********************************************************************************/

export default app;
