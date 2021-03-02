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
import {
  ApiOperationGet,
  ApiOperationPut,
  ApiPath,
  SwaggerDefinitionConstant,
} from "swagger-express-ts";
import AuthService from "@auth/services/AuthService";

const authService = inject(TYPES.AuthService);

@ApiPath({
  path: "/api/v1/profiles",
  name: "Profiles",
})
@controller("/api/v1/profiles")
class ProfilesController extends BaseHttpController {
  @authService private readonly _authService: AuthService;

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
    parameters: {
      query: {
        pageSize: {
          description:
            "Maximum ammount of items returned per page (greater than 0)",
          type: SwaggerDefinitionConstant.NUMBER,
          default: 10,
        },
        pageIndex: {
          description:
            "Index of the page that will have items returned (greater than 0)",
          type: SwaggerDefinitionConstant.NUMBER,
          default: 1,
        },
        ignorePageSize: {
          description:
            "Ignore the other pagination limitations and return all items in one single page",
          type: SwaggerDefinitionConstant.BOOLEAN,
          default: (false as unknown) as number, // Gambiarra lol
        },
      },
    },
    responses: {
      [StatusCodes.OK]: {
        description: "Success",
        model: "PagedResult",
      },
      [StatusCodes.UNAUTHORIZED]: {
        description: "Unauthorized",
        model: "AppError",
      },
    },
    security: { ["Bearer"]: [] },
  })
  @httpGet("/")
  public async list(request: Request, response: Response): Promise<Response> {
    await this._authService.ensureAuthenticated(this.httpContext);
    await this._authService.ensureHasPermission(
      this.httpContext,
      "LIST_PROFILES"
    );

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
      [StatusCodes.UNAUTHORIZED]: {
        description: "Unauthorized",
        model: "AppError",
      },
    },
    security: { ["Bearer"]: [] },
  })
  @httpPut("/:id")
  public async update(request: Request, response: Response): Promise<Response> {
    await this._authService.ensureAuthenticated(this.httpContext);
    await this._authService.ensureIsResourceOwnerOrHasPermission(
      this.httpContext,
      request.params.id,
      "EDIT_PROFILE"
    );

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
