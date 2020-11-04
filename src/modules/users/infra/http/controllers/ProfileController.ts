import { Request, Response } from "express";

import ShowProfileService from "@modules/users/services/ShowProfileService";
import UpdateProfileService from "@modules/users/services/UpdateProfileService";

export default class ProfileController {
  public async show(request: Request, response: Response): Promise<Response> {
    const { email } = request.body;

    const showProfile = new ShowProfileService();

    const { userInfo } = await showProfile.execute({
      email,
    });

    return response.status(200).json({
      msg: `Usuário ${email} encontrado!`,
      user: userInfo,
    });
  }

  public async update(request: Request, response: Response): Promise<Response> {
    const { email, name } = request.body;

    const updateProfile = new UpdateProfileService();

    const { userInfo } = await updateProfile.execute({
      email,
      name,
    });

    return response.status(200).json({
      msg: `Usuário ${email} atualizado!`,
      user: userInfo,
    });
  }
}
