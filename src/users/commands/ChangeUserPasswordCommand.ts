import { Joi, Segments, celebrate } from "celebrate";
import { Request, RequestHandler } from "express";

import Command from "@shared/messages/Command";
import Password from "@shared/richObjects/Password";
import { isValidObjectId } from "mongoose";

// TODO: Está errado! o id eu tenho que pegar a partir do email do token de autenticação (ou seja, só dá para alterar a senha de quem estiver autenticado)
class ChangeUserPasswordCommand extends Command {
  id: string;
  oldPassword: string;
  newPassword: string;

  constructor(id: string, oldPassword: string, newPassword: string) {
    super();

    this.id = id;
    this.oldPassword = oldPassword;
    this.newPassword = newPassword;
  }

  public static validator: RequestHandler = celebrate(
    {
      [Segments.PARAMS]: {
        id: Joi.string()
          .required()
          .custom((id) => isValidObjectId(id)),
      },
      [Segments.BODY]: {
        oldPassword: Joi.string()
          .required()
          .custom((password) => Password.isValid(password)),
        newPassword: Joi.string()
          .required()
          .custom((password) => Password.isValid(password)),
      },
    },
    { abortEarly: false }
  );

  public static requestToCommand = (
    request: Request
  ): ChangeUserPasswordCommand => {
    const command = new ChangeUserPasswordCommand(
      request.params.id,
      request.body.oldPassword,
      request.body.newPassword
    );

    return command;
  };
}

export default ChangeUserPasswordCommand;
