import { Router } from "express";
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import swaggerOptions from "@shared/util/swaggerOptions";

import articles from "@modules/articles/infra/http/routes/articles.routes";
import categories from "@modules/articles/infra/http/routes/categories.routes";
import images from "@modules/articles/infra/http/routes/images.routes";

import users from "@modules/users/infra/http/routes/users.routes";
import auth from "@modules/users/infra/http/routes/auth.routes";
import reset from "@modules/users/infra/http/routes/reset.routes";

const router = Router();

// Swagger JSDoc
const specs = swaggerJsdoc(swaggerOptions);
router.use("/docs", swaggerUi.serve);
router.get(
  "/docs",
  swaggerUi.setup(specs, {
    explorer: true,
  })
);

router.use("/articles", articles);
router.use("/images", images);
router.use("/categories", categories);

router.use("/users", users);
router.use("/auth", auth);
router.use("/reset", reset);

export default router;
