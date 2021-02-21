import "express-async-errors";
// controllers
import "@articles/controllers/";
import "@auth/controllers/";

import * as prettyjson from "prettyjson";

import { InversifyExpressServer, getRouteInfo } from "inversify-express-utils";

import appConfig from "./configurations/appConfig";
import { buildProviderModule } from "inversify-binding-decorators";
import { container } from "./configurations/inversify.config";
import errorConfigFn from "./configurations/errorConfigFn";
import errorHandling from "./configurations/errorConfigFn";
import startMongooseAndListen from "./services/startMongooseAndListen";

// import "@users/controllers/";
// import "@images/controllers";

// create server
const server = new InversifyExpressServer(container);

server;

/************************************************************************************
 *                                  Handle Errors
 ***********************************************************************************/

// Print API errors
server.setConfig((app) => app.use(errorHandling));
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

console.log(prettyjson.render({ routes: routeInfo }));

export default app;

// TODO: change types folder to something else to not conflict with intensify TYPES
