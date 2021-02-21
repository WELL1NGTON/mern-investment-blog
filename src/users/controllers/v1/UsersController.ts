import { Request, Response } from "express";

import ChangeUserPasswordCommand from "@users/commands/ChangeUserPasswordCommand";
import ChangeUserPasswordService from "@users/services/users/ChangeUserPasswordService";
import CreateUserAndProfileCommand from "@users/commands/CreateUserAndProfileCommand";
import CreateUserAndProfileService from "@users/services/CreateUserAndProfileService";
import DeleteUserAndProfileService from "@users/services/DeleteUserAndProfileService";
import DisableUserService from "@users/services/users/DisableUserService";
import EnableUserService from "@users/services/users/EnableUserService";
import GetUserService from "@users/services/users/GetUserService";
import ListUsersService from "@users/services/users/ListUsersService";
import { StatusCodes } from "http-status-codes";
import UpdateUserCommand from "@users/commands/UpdateUserCommand";
import UpdateUserService from "@users/services/users/UpdateUserService";
import {
  BaseHttpController,
  controller,
  httpDelete,
  httpGet,
  httpPost,
  httpPut,
} from "inversify-express-utils";
import { inject } from "inversify";
import TYPES from "@shared/constants/TYPES";
import {
  ApiOperationDelete,
  ApiOperationGet,
  ApiOperationPost,
  ApiOperationPut,
  ApiPath,
} from "swagger-express-ts";
import EnsureAuthenticated from "@auth/middleware/EnsureAuthenticated";

@ApiPath({
  path: "/api/v1/users",
  name: "Users",
})
@controller("api/v1/users")
class UsersController extends BaseHttpController {
  constructor(
    @inject(TYPES.ChangeUserPasswordService)
    private changeUserPasswordService: ChangeUserPasswordService,
    @inject(TYPES.CreateUserAndProfileService)
    private createUserAndProfileService: CreateUserAndProfileService,
    @inject(TYPES.DeleteUserAndProfileService)
    private deleteUserAndProfileService: DeleteUserAndProfileService,
    @inject(TYPES.GetUserService)
    private getUserService: GetUserService,
    @inject(TYPES.ListUsersService)
    private listUsersService: ListUsersService,
    @inject(TYPES.UpdateUserService)
    private updateUserService: UpdateUserService,
    @inject(TYPES.DisableUserService)
    private disableUserService: DisableUserService,
    @inject(TYPES.EnableUserService)
    private enableUserService: EnableUserService
  ) {
    super();
  }

  @ApiOperationGet({
    summary: "Get a list of Users",
    description: "Get Users as PagedResult",
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

    const users = await this.listUsersService.execute({
      pageSize,
      currentPage,
    });

    // Ensure it doesn't return the password
    users.list.forEach((user) => user.clearPassword());

    return response.status(StatusCodes.OK).json(users);
  }

  @ApiOperationGet({
    summary: "Get an existing User",
    description: "Get User from it's id",
    path: "/{id}",
    parameters: { path: { ["id"]: { name: "id" } } },
    responses: {
      [StatusCodes.OK]: {
        description: "Success",
        model: "User",
      },
      [StatusCodes.NOT_FOUND]: {
        description: "Not Found",
        model: "AppError",
      },
    },
    security: { basicAuth: [] },
  })
  @httpGet("/:id", EnsureAuthenticated)
  public async get(request: Request, response: Response): Promise<Response> {
    const id: string = request.params.id;

    const user = await this.getUserService.execute({ id });

    const status = user ? StatusCodes.OK : StatusCodes.NO_CONTENT;

    // Ensure it doesn't return the password
    user?.clearPassword();

    return response.status(status).json(user);
  }

  @ApiOperationPost({
    summary: "Create new User and it's Profile",
    description: "Create new User and it's Profile",
    parameters: {
      body: {
        description: "New User and it's Profile",
        required: true,
        model: "CreateUserAndProfile",
      },
    },
    responses: {
      [StatusCodes.OK]: {
        description: "Success",
      },
    },
    security: { basicAuth: [] },
  })
  @httpPost("/", EnsureAuthenticated)
  public async create(request: Request, response: Response): Promise<Response> {
    const command = CreateUserAndProfileCommand.requestToCommand(request);

    await this.createUserAndProfileService.execute(command);

    return response.status(StatusCodes.OK).send("Usuário criado com sucesso");
  }

  @ApiOperationPut({
    summary: "Update an User",
    description: "Update an existing User, based on it's id",
    path: "/{id}",
    parameters: {
      path: { ["id"]: { name: "id" } },
      body: {
        description: "Updated User",
        required: true,
        model: "UpdateUser",
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
  @httpPut("/:id", EnsureAuthenticated)
  public async update(request: Request, response: Response): Promise<Response> {
    const command = UpdateUserCommand.requestToCommand(request);

    await this.updateUserService.execute(command);

    return response
      .status(StatusCodes.OK)
      .send("Usuário atualizado com sucesso");
  }

  @ApiOperationDelete({
    summary: "Remove an User and it's Profile",
    description: "Remove an existing User, based on it's id",
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
    },
    security: { basicAuth: [] },
  })
  @httpDelete("/:id", EnsureAuthenticated)
  public async delete(request: Request, response: Response): Promise<Response> {
    const id: string = request.params.id;

    await this.deleteUserAndProfileService.execute({ id });

    return response.status(StatusCodes.OK);
  }

  // TODO: Move to auth
  @ApiOperationPost({
    summary:
      "Change authenticated user password OBSERVAÇÃO IMPORTANTE, ESSA FUNCIONALIDADE POSSIVELMENTE FIRCARIA MELHOR EM /auth",
    description: "Change authenticated user password",
    path: "/password",
    parameters: {
      body: {
        description: "Password info",
        required: true,
        model: "ChangePassword",
      },
    },
    responses: {
      [StatusCodes.OK]: {
        description: "Success",
      },
    },
    security: { basicAuth: [] },
  })
  @httpPut("/password", EnsureAuthenticated)
  public async changePassword(
    request: Request,
    response: Response
  ): Promise<Response> {
    const command = ChangeUserPasswordCommand.requestToCommand(request);

    await this.changeUserPasswordService.execute(command);

    return response
      .status(StatusCodes.OK)
      .send("Usuário atualizado com sucesso");
  }

  @ApiOperationPost({
    summary: "Activate user",
    description: "Activate an existing User, based on it's id",
    path: "/enable/{id}",
    parameters: {},
    responses: {
      [StatusCodes.OK]: {
        description: "Success",
      },
    },
    security: { basicAuth: [] },
  })
  @httpPost("/enable/:id", EnsureAuthenticated)
  public async enable(request: Request, response: Response): Promise<Response> {
    const id: string = request.params.id;

    await this.enableUserService.execute({ id });

    return response.status(StatusCodes.OK).send("Usuário ativado com sucesso");
  }

  @ApiOperationPost({
    summary: "Deactivate user",
    description: "Deactivate an existing User, based on it's id",
    path: "/disable/{id}",
    parameters: {},
    responses: {
      [StatusCodes.OK]: {
        description: "Success",
      },
    },
    security: { basicAuth: [] },
  })
  @httpPost("/disable/:id", EnsureAuthenticated)
  public async disable(
    request: Request,
    response: Response
  ): Promise<Response> {
    const id: string = request.params.id;

    await this.disableUserService.execute({ id });

    return response.status(StatusCodes.OK).send("Usuário ativado com sucesso");
  }
}

export default UsersController;
