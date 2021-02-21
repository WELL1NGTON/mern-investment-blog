import "@articles/controllers/v1/ArticlesController";
import "express-async-errors";

import * as swagger from "swagger-express-ts";

import express, { Application, Request, Response } from "express";

import cookieParser from "cookie-parser";
import { cookieProps } from "./cookieProps";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
import swaggerExpressTsOptions from "./swaggerExpressTsOptions";

// import swaggerJSDocOptions from "./swaggerJSDocOptions";
// import swaggerUi from "swagger-ui-express";
// import * as bodyParser from "body-parser";

function appConfig(app: Application): void {
  /************************************************************************************
   *                           Set basic express settings
   ***********************************************************************************/
  // add body parser
  // app.use(
  //   bodyParser.urlencoded({
  //     extended: true,
  //   })
  // );
  // app.use(bodyParser.json());

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser(cookieProps.secret));

  /************************************************************************************
   *                 Show routes called in console during development
   ***********************************************************************************/

  if (process.env.NODE_ENV === "development") {
    app.use(morgan("dev"));
  }

  /************************************************************************************
   *                                    Security
   ***********************************************************************************/
  if (process.env.NODE_ENV === "production") {
    app.use(helmet());
  }

  /************************************************************************************
   *                             Serve front-end content
   ***********************************************************************************/

  //Serve static assets if in production
  if (process.env.NODE_ENV === "production") {
    // Set static folder
    app.use(express.static("client/build"));

    app.get("*", (request: Request, response: Response) => {
      response.sendFile(
        path.resolve(__dirname + "./", "client", "build", "index.html")
      );
    });
  }

  /************************************************************************************
   *                                   Use Swagger
   ***********************************************************************************/

  if (process.env.NODE_ENV === "development") {
    // app.use("/swagger", swaggerUi.serve, swaggerUi.setup(swaggerJSDocOptions));

    app.use("/api-docs/swagger", express.static("swagger"));
    app.use(
      "/api-docs/swagger/assets",
      express.static("node_modules/swagger-ui-dist")
    );
    app.use(swagger.express(swaggerExpressTsOptions));
  }

  /************************************************************************************
   *                                   Use Routes
   ***********************************************************************************/

  // // Add Routes
  // app.use("/api", BaseRouter);
}

export default appConfig;
