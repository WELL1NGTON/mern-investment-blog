import {
  mongooseConnectOptions,
  mongooseConnectionString,
} from "../configurations/mongooseConfigurations";

import logger from "./Logger";
import mongoose from "mongoose";

// import addTestData from "./addTestData";

const startMongooseAndListen = (): void => {
  if (mongooseConnectionString) {
    mongoose.connect(mongooseConnectionString, mongooseConnectOptions);

    const connection = mongoose.connection;

    connection.once("open", () => {
      logger.info("MongoDB database connection established successfully");
      //  addTestData();
    });
  }
};

export default startMongooseAndListen;
