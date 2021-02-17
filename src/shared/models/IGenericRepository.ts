import { Document } from 'mongoose';
import Entity from './Entity';
import PagedResult from '@shared/models/PagedResult';

interface IGenericRepository<T extends Entity, U extends Document> {
  getAll: (
    pageSize?: number,
    currentPage?: number,
    query?: string
  ) => Promise<PagedResult<T>>;
  getAllIgnoringPageSize: () => Promise<PagedResult<T>>;
  getById: (id: string) => Promise<T | null>;
  create: (entity: T) => Promise<null>;
  update: (entity: T) => Promise<null>;
  delete: (id: string) => Promise<null>;

  documentToEntity: (document: U) => T;
  entityToDocument: (entity: T) => U;
}

export default IGenericRepository;
