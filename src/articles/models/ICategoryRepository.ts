import Category from "./Category";
import { ICategoryMongooseDocument } from "@articles/data/mappings/CategoryModel";
import IGenericRepository from "@shared/models/IGenericRepository";

interface ICategoryRepository
  extends IGenericRepository<Category, ICategoryMongooseDocument> {}

export default ICategoryRepository;
