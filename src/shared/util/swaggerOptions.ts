import swaggerJsdoc from "swagger-jsdoc";

// Swagger set up
const swaggerOptions: swaggerJsdoc.Options = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: "Time to document that Express API you built",
      version: "1.0.0",
      description:
        "A test project to understand how easy it is to document and Express API",
    },
    license: {
      name: "MIT",
      url: "https://choosealicense.com/licenses/mit/",
    },
    contact: {
      name: "Swagger",
      url: "https://swagger.io",
      email: "Info@SmartBear.com",
    },
    servers: [
      {
        url: (process.env.BACKEND_URL || "http://localhost:5000") + "/api/",
      },
    ],
  },
  apis: [
    "./src/shared/models/*.ts",
    "./src/modules/users/infra/http/routes/*.ts",
    "./src/modules/articles/infra/http/routes/*.ts",
    "./src/shared/errors/*.ts",
  ],
};

export default swaggerOptions;
