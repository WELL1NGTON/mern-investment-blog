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
import TYPES from "@shared/constants/TYPES";
import { ApiOperationGet, ApiOperationPut, ApiPath } from "swagger-express-ts";
import EnsureAuthenticated from "@auth/middleware/EnsureAuthenticated";

// import { container } from "tsyringe";

@ApiPath({
  path: "/api/v1/profiles",
  name: "Profiles",
})
@controller("api/v1/profiles")
class ProfilesController extends BaseHttpController {
  constructor(
    @inject(TYPES.GetProfileService)
    private getProfileService: GetProfileService,
    @inject(TYPES.ListProfilesService)
    private listProfilesService: ListProfilesService,
    @inject(TYPES.UpdateProfileService)
    private updateProfileService: UpdateProfileService
  ) {
    super();
  }

  @ApiOperationGet({
    summary: "Get a list of Profiles",
    description: "Get Profiles as PagedResult",
    responses: {
      [StatusCodes.OK]: {
        description: "Success",
        model: "PagedResult",
      },
    },
    security: { basicAuth: [] },
  })
  @httpGet("/", EnsureAuthenticated)
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

  @ApiOperationGet({
    summary: "Get an existing Profile",
    description: "Get Profile from it's id",
    path: "/{id}",
    parameters: { path: { ["id"]: { name: "id" } } },
    responses: {
      [StatusCodes.OK]: {
        description: "Success",
        model: "Profile",
      },
      [StatusCodes.NOT_FOUND]: {
        description: "Not Found",
        model: "AppError",
      },
    },
  })
  @httpGet("/:id", EnsureAuthenticated)
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

  @ApiOperationPut({
    summary: "Update an Profile",
    description: "Update an existing Profile, based on it's id",
    path: "/{id}",
    parameters: {
      path: { ["id"]: { name: "id" } },
      body: {
        description: "Updated Profile",
        required: true,
        model: "UpdateProfile",
      },
    },
    responses: {
      [StatusCodes.OK]: {
        description: "Success",
      },
      [StatusCodes.NOT_FOUND]: {
        description: "Not Found",
        model: "AppError",
      },
    },
    security: { basicAuth: [] },
  })
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
