import "@articles/controllers/";
import "@auth/controllers/";
import "@users/controllers/";
import "@images/controllers/";
import "express-async-errors";

import * as prettyjson from "prettyjson";

import { InversifyExpressServer, getRouteInfo } from "inversify-express-utils";

import CustomAuthProvider from "@auth/services/CustomAuthProvider";
import appConfig from "./configurations/appConfig";
import { container } from "./configurations/inversify.config";
import errorConfigFn from "./configurations/errorConfigFn";
import startMongooseAndListen from "./services/startMongooseAndListen";

// controllers
// import "@images/controllers";

// create server
const server = new InversifyExpressServer(
  container,
  null,
  null,
  null,
  CustomAuthProvider
);

/************************************************************************************
 *                                  Handle Errors
 ***********************************************************************************/

// Print API errors
// server.setConfig((app) => app.use(errorHandling));
// app.use(errorHandling);

/************************************************************************************
 *                                 Connect to Database
 ***********************************************************************************/

startMongooseAndListen();

/************************************************************************************
 *                                   Export Server
 ***********************************************************************************/

const app = server.setConfig(appConfig).setErrorConfig(errorConfigFn).build();

const routeInfo = getRouteInfo(container);

// Print api routes on start
console.log(prettyjson.render({ routes: routeInfo }));

export default app;

// TODO: change types folder to something else to not conflict with intensify TYPES
