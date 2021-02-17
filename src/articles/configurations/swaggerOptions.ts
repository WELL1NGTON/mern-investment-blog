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
    // TODO: Verfify what license will be used
    // license: {
    //   name: 'MIT',
    //   url: 'https://choosealicense.com/licenses/mit/',
    // },
    // TODO: Change contact
    contact: {
      name: "",
      url: "",
      email: "",
    },
    servers: [
      {
        // TODO: CONFIG API
        url: (process.env.BACKEND_URL || "http://localhost:5000") + "/api/",
      },
    ],
  },
  // TODO: FIX PATHS
  apis: [
    "./src/shared/models/*.ts",
    "./src/modules/users/infra/http/routes/*.ts",
    "./src/modules/articles/infra/http/routes/*.ts",
    "./src/shared/errors/*.ts",
  ],
};

export default swaggerOptions;
