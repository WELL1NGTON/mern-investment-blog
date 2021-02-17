import ArticleRepository from "@articles/data/repository/ArticleRepository";
import CategoryRepository from "@articles/data/repository/CategoryRepository";
import IArticleRepository from "@articles/models/IArticleRepository";
import ICategoryRepository from "@articles/models/ICategoryRepository";
import { container } from "tsyringe";

container.registerSingleton<IArticleRepository>(
  "ArticleRepository",
  ArticleRepository
);
container.registerSingleton<ICategoryRepository>(
  "CategoryRepository",
  CategoryRepository
);
