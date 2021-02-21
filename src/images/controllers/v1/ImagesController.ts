import {
  BaseHttpController,
  controller,
  httpDelete,
  httpGet,
  httpPost,
  httpPut,
  interfaces,
} from "inversify-express-utils";
import { Request, Response } from "express";

import CreateArticleCommand from "@articles/commands/CreateArticleCommand";
import CreateArticleService from "@articles/services/articles/CreateArticleService";
import DeleteArticleService from "@articles/services/articles/DeleteArticleService";
import GetArticleService from "@articles/services/articles/GetArticleService";
import ListArticlesService from "@articles/services/articles/ListArticlesService";
import { StatusCodes } from "http-status-codes";
import UpdateArticleCommand from "@articles/commands/UpdateArticleCommand";
import UpdateArticleService from "@articles/services/articles/UpdateArticleService";
import { inject } from "inversify";

@controller("api/v1/images")
class ImagesController extends BaseHttpController {
  // constructor(
  //   @inject("CreateArticleService")
  //   private createArticleService: CreateArticleService,
  //   @inject("DeleteArticleService")
  //   private deleteArticleService: DeleteArticleService,
  //   @inject("GetArticleService")
  //   private getArticleService: GetArticleService,
  //   @inject("ListArticlesService")
  //   private listArticlesService: ListArticlesService,
  //   @inject("UpdateArticleService")
  //   private updateArticleService: UpdateArticleService
  // ) {
  //   super();
  // }
  // @httpGet("/")
  // public async list(request: Request, response: Response): Promise<Response> {
  //   const ignorePageSize =
  //     request.query.ignorePageSize === "true" ? true : false;
  //   // const orderBy = request.query.orderBy
  //   //   ? {
  //   //       orderBy: request.query.orderBy as string,
  //   //       orderDirection: (request.query.orderBy as string) ?? "ASC",
  //   //     }
  //   //   : undefined;
  //   const pageSize = request.query.pageSize
  //     ? parseInt(request.query.pageSize as string)
  //     : undefined;
  //   const pageIndex = request.query.pageIndex
  //     ? parseInt(request.query.pageIndex as string)
  //     : undefined;
  //   const articles = await this.listArticlesService.execute({
  //     pageSize,
  //     pageIndex,
  //     ignorePageSize,
  //   });
  //   return response.status(StatusCodes.OK).json(articles);
  // }
  // @httpGet("/:id")
  // public async get(request: Request, response: Response): Promise<Response> {
  //   const slug: string = request.params.slug;
  //   const article = this.getArticleService.execute({ slug });
  //   const status = article ? StatusCodes.OK : StatusCodes.NO_CONTENT;
  //   return response.status(status).json(article);
  // }
  // @httpPost("/")
  // public async create(request: Request, response: Response): Promise<Response> {
  //   const command = CreateArticleCommand.requestToCommand(request);
  //   await this.createArticleService.execute(command);
  //   return response.status(StatusCodes.OK).send("Artigo criado com sucesso");
  // }
  // @httpPut("/:id")
  // public async update(request: Request, response: Response): Promise<Response> {
  //   const command = UpdateArticleCommand.requestToCommand(request);
  //   await this.updateArticleService.execute(command);
  //   return response
  //     .status(StatusCodes.OK)
  //     .send("Artigo atualizado com sucesso");
  // }
  // @httpDelete("/:id")
  // public async delete(request: Request, response: Response): Promise<Response> {
  //   const slug: string = request.params.slug;
  //   await this.deleteArticleService.execute({ slug });
  //   return response.status(StatusCodes.OK);
  // }
}

export default ImagesController;
