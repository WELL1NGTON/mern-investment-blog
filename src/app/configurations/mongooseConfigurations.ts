import mongoose, { ConnectOptions } from "mongoose";

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

    // const newUser = new User({
    //   title,
    //   description,
    //   markdownArticle,
    //   date,
    //   tags,
    //   author,
    //   state,
    //   visibility,
    //   category,
    //   previewImg,
    // });

    // const savedUser = await newUser.save();
  });
}

export const mongooseConnectOptions: ConnectOptions = {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
};

export const mongooseConnectionString = process.env.MONGO_URI;
