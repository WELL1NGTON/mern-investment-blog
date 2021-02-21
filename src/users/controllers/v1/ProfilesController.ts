import {
  BaseHttpController,
  controller,
  httpGet,
  httpPost,
  httpPut,
} from "inversify-express-utils";
import { Request, Response } from "express";

import GetProfileService from "@users/services/profile/GetProfileService";
import ListProfilesService from "@users/services/profile/ListProfilesService";
import { StatusCodes } from "http-status-codes";
import UpdateProfileCommand from "@users/commands/UpdateProfileCommand";
import UpdateProfileService from "@users/services/profile/UpdateProfileService";
import { inject } from "inversify";

// import { container } from "tsyringe";

@controller("api/v1/profiles")
class ProfilesController extends BaseHttpController {
  constructor(
    @inject("GetProfileService")
    private getProfileService: GetProfileService,
    @inject("ListProfilesService")
    private listProfilesService: ListProfilesService,
    @inject("UpdateProfileService")
    private updateProfileService: UpdateProfileService
  ) {
    super();
  }

  @httpGet("/")
  public async list(request: Request, response: Response): Promise<Response> {
    // const orderBy = request.query.orderBy
    //   ? {
    //       orderBy: request.query.orderBy as string,
    //       orderDirection: (request.query.orderBy as string) ?? "ASC",
    //     }
    //   : undefined;

    const pageSize = request.query.pageSize
      ? parseInt(request.query.pageSize as string)
      : undefined;
    const currentPage = request.query.currentPage
      ? parseInt(request.query.currentPage as string)
      : undefined;

    const articles = await this.listProfilesService.execute({
      pageSize,
      currentPage,
    });

    return response.status(StatusCodes.OK).json(articles);
  }

  @httpGet("/:id")
  public async get(request: Request, response: Response): Promise<Response> {
    const id: string = request.params.id;

    const article = await this.getProfileService.execute({ id });

    const status = article ? StatusCodes.OK : StatusCodes.NO_CONTENT;

    return response.status(status).json(article);
  }

  @httpPost("/")
  public async create(/*request: Request, response: Response*/): Promise<Response> {
    throw new Error("Method not implemented.");
  }

  @httpPut("/:id")
  public async update(request: Request, response: Response): Promise<Response> {
    const command = UpdateProfileCommand.requestToCommand(request);

    await this.updateProfileService.execute(command);

    return response
      .status(StatusCodes.OK)
      .send("Artigo atualizado com sucesso");
  }

  public async delete(/*request: Request, response: Response*/): Promise<Response> {
    throw new Error("Method not implemented.");
  }
}

export default ProfilesController;
