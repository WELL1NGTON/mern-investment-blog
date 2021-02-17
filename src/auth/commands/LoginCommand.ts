import { Joi, Segments, celebrate } from "celebrate";
import { Request, RequestHandler } from "express";

import Command from "@shared/messages/Command";
import Email from "@shared/richObjects/Email";
import Password from "@shared/richObjects/Password";

class LoginCommand extends Command {
  email: string;
  password: string;

  constructor(email: string, password: string) {
    super();

    this.email = email;
    this.password = password;
  }

  public static validator: RequestHandler = celebrate(
    {
      [Segments.BODY]: {
        email: Joi.string().required(),
        // .custom((email) => Email.isValid(email)),
        password: Joi.string().required(),
        // .custom((password) => Password.isValid(password)),
      },
    },
    { abortEarly: false }
  );

  public static requestToCommand = (request: Request): LoginCommand => {
    const command = new LoginCommand(request.body.email, request.body.password);

    return command;
  };
}

export default LoginCommand;
