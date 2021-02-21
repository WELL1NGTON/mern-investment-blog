import IArticleRepository from "@articles/models/IArticleRepository";
import TYPES from "@shared/constants/TYPES";
import { Container, inject, injectable } from "inversify";
interface IRequest {
  slug: string;
}

export interface IDeleteArticleService {
  execute({ slug }: IRequest): Promise<null>;
}

@injectable()
class DeleteArticleService implements IDeleteArticleService {
  constructor(
    @inject(TYPES.IArticleRepository)
    private articleRepository: IArticleRepository
  ) {}

  public async execute({ slug }: IRequest): Promise<null> {
    return await this.articleRepository.delete(slug);
  }
}

export default DeleteArticleService;
