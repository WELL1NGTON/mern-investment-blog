const swaggerJsdoc = require("swagger-jsdoc");

// import "@articles/routes/v1/articlesRoutes";

const options = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: "Blog API",
      version: "1.0.0",
    },
  },
  apis: ["**/*Routes.ts"],
};

const swaggerJSDocOptions = swaggerJsdoc(options);

export default swaggerJSDocOptions;
