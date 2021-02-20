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
import { container } from "tsyringe";

class UsersController {
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

    const users = await container
      .resolve(ListUsersService)
      .execute({ pageSize, currentPage });

    // Ensure it doesn't return the password
    users.list.forEach((user) => user.clearPassword());

    return response.status(StatusCodes.OK).json(users);
  }

  public async get(request: Request, response: Response): Promise<Response> {
    const id: string = request.params.id;

    const user = await container.resolve(GetUserService).execute({ id });

    const status = user ? StatusCodes.OK : StatusCodes.NO_CONTENT;

    // Ensure it doesn't return the password
    user?.clearPassword();

    return response.status(status).json(user);
  }

  public async create(request: Request, response: Response): Promise<Response> {
    const command = CreateUserAndProfileCommand.requestToCommand(request);

    await container.resolve(CreateUserAndProfileService).execute(command);

    return response.status(StatusCodes.OK).send("Usuário criado com sucesso");
  }

  public async update(request: Request, response: Response): Promise<Response> {
    const command = UpdateUserCommand.requestToCommand(request);

    await container.resolve(UpdateUserService).execute(command);

    return response
      .status(StatusCodes.OK)
      .send("Usuário atualizado com sucesso");
  }

  public async delete(request: Request, response: Response): Promise<Response> {
    const id: string = request.params.id;

    await container.resolve(DeleteUserAndProfileService).execute({ id });

    return response.status(StatusCodes.OK);
  }

  public async changePassword(
    request: Request,
    response: Response
  ): Promise<Response> {
    const command = ChangeUserPasswordCommand.requestToCommand(request);

    await container.resolve(ChangeUserPasswordService).execute(command);

    return response
      .status(StatusCodes.OK)
      .send("Usuário atualizado com sucesso");
  }

  public async enable(request: Request, response: Response): Promise<Response> {
    const id: string = request.params.id;

    await container.resolve(EnableUserService).execute({ id });

    return response.status(StatusCodes.OK).send("Usuário ativado com sucesso");
  }

  public async disable(
    request: Request,
    response: Response
  ): Promise<Response> {
    const id: string = request.params.id;

    await container.resolve(DisableUserService).execute({ id });

    return response.status(StatusCodes.OK).send("Usuário ativado com sucesso");
  }
}

export default UsersController;
