import { Request, Response } from "express";

import CreateUserService from "@modules/users/services/CreateUserService";

export default class SessionsController {
  public async create(request: Request, response: Response): Promise<Response> {
    const { name, email, password, role, info, image } = request.body;

    const createUser = new CreateUserService();

    const { userInfo } = await createUser.execute({
      email,
      password,
      name,
      role,
      info,
      image
    });

    return response.status(201).json({
      message: "Usuário criado com sucesso!",
      user: userInfo,
    });
  }
}
