import { Request, Response } from "express";
// import { container } from 'tsyringe';

import SendForgotPasswordService from "@modules/users/services/SendForgotPasswordService";
import ChangePasswordService from "@modules/users/services/ChangePasswordService";

const sendForgotPassword = new SendForgotPasswordService();
const changePassword = new ChangePasswordService();

export default class ForgotPasswordController {
  public async sendToken(
    request: Request,
    response: Response
  ): Promise<Response> {
    const { email } = request.body;

    // const { resetLink } =
    await sendForgotPassword.execute({
      email,
    });

    return response.json({
      msg: "Email enviado com sucesso!",
    });
  }

  public async reset(request: Request, response: Response): Promise<Response> {
    const { password } = request.body;
    const { token } = request.params;

    const res = await changePassword.execute({ password, token });

    return response.json({
      msg: "Email enviado com sucesso!",
      res,
    });
  }
}
