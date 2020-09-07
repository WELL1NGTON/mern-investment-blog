const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

//environment variables
require('dotenv').config();

//express server
const app = express();
const port = process.env.port || 5000;

//middleware
app.use(cors());
app.use(express.json());

const uri = process.env.ATLAS_URI;
mongoose.connect(uri, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true });
const connection = mongoose.connection;
connection.once('open', () => {
  console.log('MongoDB database connection established successfully');
});

// const exercisesRouter = require('./routes/exercises');
// const usersRouter = require('./routes/users');
const articlesRouter = require('./routes/articles');

// app.use('/exercises', exercisesRouter);
// app.use('/users', usersRouter);
app.use('/articles', articlesRouter);

//start listening
app.listen(port, () => {
  console.log(`server is running on port:  ${port}`);
});
