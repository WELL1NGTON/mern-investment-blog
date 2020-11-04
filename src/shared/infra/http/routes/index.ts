import { Router } from "express";

import articles from "@modules/articles/infra/http/routes/articles.routes";
import categories from "@modules/articles/infra/http/routes/categories.routes";
import images from "@modules/articles/infra/http/routes/images.routes";

// import users from "@modules/users/infra/http/routes/users.routes";
// import auth from "@modules/users/infra/http/routes/auth.routes";
import reset from "@modules/users/infra/http/routes/reset.routes";

const routes = Router();

routes.use("/articles", articles);
routes.use("/images", images);
routes.use("/categories", categories);

routes.use("/users", require("@modules/users/infra/http/routes/users.routes"));
routes.use("/auth", require("@modules/users/infra/http/routes/auth.routes"));
routes.use("/reset", reset);

export default routes;
