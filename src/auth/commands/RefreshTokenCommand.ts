import { Joi, Segments, celebrate } from "celebrate";
import { Request, RequestHandler } from "express";

import Command from "@shared/messages/Command";

class RefreshTokenCommand extends Command {
  refreshToken: string;

  constructor(refreshToken: string) {
    super();

    this.refreshToken = refreshToken;
  }

  public static validator: RequestHandler = celebrate(
    {
      [Segments.BODY]: {
        refreshToken: Joi.string().required(),
      },
    },
    { abortEarly: false }
  );

  public static requestToCommand = (request: Request): RefreshTokenCommand => {
    const command = new RefreshTokenCommand(request.body.refreshToken);

    return command;
  };
}

export default RefreshTokenCommand;
