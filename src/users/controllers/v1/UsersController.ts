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

// import { container } from "tsyringe";

@controller("api/v1/users")
class UsersController extends BaseHttpController {
  constructor(
    @inject("ChangeUserPasswordService")
    private changeUserPasswordService: ChangeUserPasswordService,
    @inject("CreateUserAndProfileService")
    private createUserAndProfileService: CreateUserAndProfileService,
    @inject("DeleteUserAndProfileService")
    private deleteUserAndProfileService: DeleteUserAndProfileService,
    @inject("GetUserService")
    private getUserService: GetUserService,
    @inject("ListUsersService")
    private listUsersService: ListUsersService,
    @inject("UpdateUserService")
    private updateUserService: UpdateUserService,
    @inject("DisableUserService")
    private disableUserService: DisableUserService,
    @inject("EnableUserService")
    private enableUserService: EnableUserService
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

    const users = await this.listUsersService.execute({
      pageSize,
      currentPage,
    });

    // Ensure it doesn't return the password
    users.list.forEach((user) => user.clearPassword());

    return response.status(StatusCodes.OK).json(users);
  }

  @httpGet("/:id")
  public async get(request: Request, response: Response): Promise<Response> {
    const id: string = request.params.id;

    const user = await this.getUserService.execute({ id });

    const status = user ? StatusCodes.OK : StatusCodes.NO_CONTENT;

    // Ensure it doesn't return the password
    user?.clearPassword();

    return response.status(status).json(user);
  }

  @httpPost("/")
  public async create(request: Request, response: Response): Promise<Response> {
    const command = CreateUserAndProfileCommand.requestToCommand(request);

    await this.createUserAndProfileService.execute(command);

    return response.status(StatusCodes.OK).send("Usuário criado com sucesso");
  }

  @httpPut("/:id")
  public async update(request: Request, response: Response): Promise<Response> {
    const command = UpdateUserCommand.requestToCommand(request);

    await this.updateUserService.execute(command);

    return response
      .status(StatusCodes.OK)
      .send("Usuário atualizado com sucesso");
  }

  @httpDelete("/:id")
  public async delete(request: Request, response: Response): Promise<Response> {
    const id: string = request.params.id;

    await this.deleteUserAndProfileService.execute({ id });

    return response.status(StatusCodes.OK);
  }

  @httpPut("/password")
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

  @httpPost("/enable/:id")
  public async enable(request: Request, response: Response): Promise<Response> {
    const id: string = request.params.id;

    await this.enableUserService.execute({ id });

    return response.status(StatusCodes.OK).send("Usuário ativado com sucesso");
  }

  @httpPost("/disable/:id")
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
