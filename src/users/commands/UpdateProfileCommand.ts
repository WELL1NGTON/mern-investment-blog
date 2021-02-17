import { Joi, Segments, celebrate } from "celebrate";
import { Request, RequestHandler } from "express";

import Command from "@shared/messages/Command";
import { isValidObjectId } from "mongoose";

class UpdateProfileCommand extends Command {
  id: string;
  name: string;
  about?: string;
  profileImage?: string;
  contact?: [string, string][];

  constructor(
    id: string,
    name: string,
    about?: string,
    profileImage?: string,
    contact: [string, string][] = []
  ) {
    super();

    this.id = id;
    this.name = name;
    this.about = about;
    this.profileImage = profileImage;
    this.contact = contact;
  }

  public static validator: RequestHandler = celebrate(
    {
      [Segments.PARAMS]: {
        id: Joi.string()
          .required()
          .custom((id) => isValidObjectId(id)),
      },
      [Segments.BODY]: {
        name: Joi.string().required().min(3),
        about: Joi.string(),
        profileImage: Joi.string().uri(),
        contact: Joi.array().items(Joi.any()), // TODO: Arruamr isso para aceitar apenas tuplas string,string
      },
    },
    { abortEarly: false }
  );

  public static requestToCommand = (request: Request): UpdateProfileCommand => {
    const command = new UpdateProfileCommand(
      request.params.id,
      request.body.email,
      request.body.password,
      request.body.role,
      request.body.isActive
    );

    return command;
  };
}

export default UpdateProfileCommand;
