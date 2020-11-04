import { Request, Response } from "express";
import RefreshToken from "@shared/models/refreshToken.model";
import AuthenticateUserService from "@modules/users/services/AuthenticateUserService";
import LogoutUserService from "@modules/users/services/LogoutUserService";
import AppError from "@shared/errors/AppError";

const authenticateUser = new AuthenticateUserService();
const logoutUser = new LogoutUserService();

export default class SessionsController {
  public async login(request: Request, response: Response): Promise<Response> {
    const { email, password } = request.body;

    const {
      userInfo,
      accessToken,
      refreshToken,
    } = await authenticateUser.execute({
      email,
      password,
    });

    return response
      .cookie("access-token", accessToken, { httpOnly: true })
      .cookie("refresh-token", refreshToken, { httpOnly: true })
      .status(200)
      .json({
        msg: "Usuário autenticado com sucesso!",
        user: userInfo,
      });
  }

  public async logout(request: Request, response: Response): Promise<Response> {
    const refreshToken = request.cookies["refresh-token"];
    const { success } = await logoutUser.execute({ refreshToken });

    // const logoutOption = request.body.logoutOption;

    if (typeof refreshToken !== "string")
      throw new AppError("Usuário não está autenticado.", 400);

    const token = RefreshToken.findOneAndDelete({ token: refreshToken });

    if (success)
      return response
        .clearCookie("refresh-token")
        .clearCookie("access-token")
        .status(200)
        .json({ msg: "Usuário desautenticado com sucesso!", success: true });
    else throw new AppError("Falha ao desautenticar usuário.", 500);
  }
}
