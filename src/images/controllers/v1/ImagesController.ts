import AuthService from "@auth/services/AuthService";
import CreateImagePathCommand from "@images/commands/CreateImagePathCommand";
import GetImageService from "@images/services/GetImageService";
import ListImagesService from "@images/services/ListImagesService";
import UploadImageService from "@images/services/UploadImageService";
import SupportedImageFormat from "@images/types/SupportedImageFormat";
import TYPES from "@shared/constants/TYPES";
import AppError from "@shared/errors/AppError";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { inject } from "inversify";
import {
  BaseHttpController,
  controller,
  httpDelete,
  httpGet,
  httpPost,
} from "inversify-express-utils";
import {
  ApiOperationDelete,
  ApiOperationGet,
  ApiOperationPost,
  ApiPath,
  SwaggerDefinitionConstant,
} from "swagger-express-ts";

const authService = inject(TYPES.AuthService);

@ApiPath({
  path: "/api/v1/images",
  name: "Images",
})
@controller("/api/v1/images")
class ImagesController extends BaseHttpController {
  @authService private readonly _authService: AuthService;

  constructor(
    @inject(TYPES.UploadImageService)
    private uploadImageService: UploadImageService,
    @inject(TYPES.ListImagesService)
    private listImagesService: ListImagesService,
    @inject(TYPES.GetImageService)
    private getImageService: GetImageService
  ) {
    super();
  }

  @ApiOperationGet({
    summary: "Get a list of Images",
    description: "Get Images as PagedResult",
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
    },
    security: { ["Bearer"]: [] },
  })
  @httpGet("/")
  public async list(request: Request, response: Response): Promise<Response> {
    await this._authService.ensureAuthenticated(this.httpContext);
    await this._authService.ensureHasPermission(
      this.httpContext,
      "LIST_IMAGES"
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

    const categories = await this.listImagesService.execute({
      pageSize,
      currentPage,
    });

    return response.status(StatusCodes.OK).json(categories);
  }

  @ApiOperationGet({
    summary: "Get an existing ImagePath",
    description: "Get ImagePath from it's id",
    path: "/{id}",
    parameters: { path: { ["id"]: { name: "id" } } },
    responses: {
      [StatusCodes.OK]: {
        description: "Success",
        model: "ImagePath",
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

    const category = await this.getImageService.execute({ id });

    const status = category ? StatusCodes.OK : StatusCodes.NOT_FOUND;

    return response.status(status).json(category);
  }

  @ApiOperationPost({
    summary: "Image new Image",
    description: "Image new Image",
    parameters: {
      body: {
        description: "New Image",
        required: true,
        model: "UploadImage",
      },
    },
    responses: {
      [StatusCodes.OK]: {
        description: "Success",
      },
      [StatusCodes.UNAUTHORIZED]: {
        description: "Unauthorized",
        model: "AppError",
      },
    },
    security: { ["Bearer"]: [] },
  })
  @httpPost("/", TYPES.MulterMiddlewareImage)
  public async create(request: Request, response: Response): Promise<Response> {
    await this._authService.ensureAuthenticated(this.httpContext);
    await this._authService.ensureHasPermission(
      this.httpContext,
      "UPLOAD_IMAGE"
    );

    const command = CreateImagePathCommand.requestToCommand(request);

    const file = request.file;

    if (!file)
      throw new AppError("Erro no upload do arquivo.", StatusCodes.BAD_REQUEST);

    await this.uploadImageService.execute({
      file,
      uploadedBy: "",
      name: command.name,
      tags: command.tags,
      format: command.format as SupportedImageFormat,
      quality: command.quality,
      size: command.size,
    });
    return response.status(StatusCodes.OK).send("Artigo criado com sucesso");
  }

  @ApiOperationDelete({
    summary: "Remove a Image",
    description: "Remove an existing Image, based on it's id",
    path: "/{id}",
    parameters: {
      path: { ["id"]: { name: "id" } },
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
  @httpDelete("/:id")
  public async delete(request: Request, response: Response): Promise<Response> {
    await this._authService.ensureAuthenticated(this.httpContext);
    await this._authService.ensureHasPermission(
      this.httpContext,
      "DELETE_IMAGE"
    );
    return response.status(StatusCodes.NOT_IMPLEMENTED).json();
  }
}

export default ImagesController;
