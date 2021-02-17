import {
  mongooseConnectOptions,
  mongooseConnectionString,
} from "../configurations/mongooseConfigurations";

import addTestData from "@app/services/addTestData";
import logger from "./Logger";
import mongoose from "mongoose";

const startMongooseAndListen = () => {
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
