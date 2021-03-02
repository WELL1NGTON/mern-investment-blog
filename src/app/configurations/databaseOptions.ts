const databaseOptions = Object.freeze({
  mongo: {
    connectionString: process.env.MONGO_URI,
  },
});

export default databaseOptions;
