import { Request, Response } from "express";

import GetProfileService from "@users/services/profile/GetProfileService";
import ListProfilesService from "@users/services/profile/ListProfilesService";
import { StatusCodes } from "http-status-codes";
import UpdateProfileCommand from "@users/commands/UpdateProfileCommand";
import UpdateProfileService from "@users/services/profile/UpdateProfileService";
import { container } from "tsyringe";

class ProfilesController {
  public async list(request: Request, response: Response): Promise<Response> {
    const orderBy = request.query.orderBy
      ? {
          orderBy: request.query.orderBy as string,
          orderDirection: (request.query.orderBy as string) ?? "ASC",
        }
      : undefined;

    const pageSize = request.query.pageSize
      ? parseInt(request.query.pageSize as string)
      : undefined;
    const currentPage = request.query.currentPage
      ? parseInt(request.query.currentPage as string)
      : undefined;

    const articles = await container
      .resolve(ListProfilesService)
      .execute({ pageSize, currentPage });

    return response.status(StatusCodes.OK).json(articles);
  }

  public async get(request: Request, response: Response): Promise<Response> {
    const id: string = request.params.id;

    const article = await container.resolve(GetProfileService).execute({ id });

    const status = article ? StatusCodes.OK : StatusCodes.NO_CONTENT;

    return response.status(status).json(article);
  }

  public async create(request: Request, response: Response): Promise<Response> {
    throw new Error("Method not implemented.");
  }

  public async update(request: Request, response: Response): Promise<Response> {
    const command = UpdateProfileCommand.requestToCommand(request);

    await container.resolve(UpdateProfileService).execute(command);

    return response
      .status(StatusCodes.OK)
      .send("Artigo atualizado com sucesso");
  }

  public async delete(request: Request, response: Response): Promise<Response> {
    throw new Error("Method not implemented.");
  }
}

export default ProfilesController;
