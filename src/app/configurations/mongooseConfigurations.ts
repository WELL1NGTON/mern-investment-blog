import mongoose, { ConnectOptions } from "mongoose";

import databaseOptions from "./databaseOptions";

const uri = databaseOptions.mongo.connectionString;
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

export const mongooseConnectOptions: ConnectOptions = {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
};

export const mongooseConnectionString = process.env.MONGO_URI;
