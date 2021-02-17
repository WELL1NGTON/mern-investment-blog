import Article from "./Article";
import { IArticleMongooseDocument } from "@articles/data/mappings/ArticleModel";
import IGenericRepository from "@shared/models/IGenericRepository";

interface IArticleRepository
  extends IGenericRepository<Article, IArticleMongooseDocument> {
  getBySlug: (slug: string) => Promise<Article | null>;
  deleteBySlug: (slug: string) => Promise<Article | null>;
}

export default IArticleRepository;
