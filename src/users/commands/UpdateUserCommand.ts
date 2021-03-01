import { Joi, Segments, celebrate } from "celebrate";
import { Request, RequestHandler } from "express";
import Role, { defaultRole, matchRoles } from "@shared/types/Role";

import Command from "@shared/messages/Command";
import Email from "@shared/valueObjects/Email";
import Password from "@shared/valueObjects/Password";
import { isValidObjectId } from "mongoose";

class UpdateUserCommand extends Command {
  id: string;
  email: string;
  password: string;
  role: Role;
  isActive!: boolean;

  constructor(
    id: string,
    email: string,
    password: string,
    role?: Role,
    isActive?: boolean
  ) {
    super();

    this.id = id;
    this.email = email;
    this.password = password;
    this.role = role ?? defaultRole;
    this.isActive = isActive ?? true;
  }

  public static validator: RequestHandler = celebrate(
    {
      [Segments.PARAMS]: {
        id: Joi.string()
          .required()
          .custom((id) => isValidObjectId(id)),
      },
      [Segments.BODY]: {
        email: Joi.string()
          .required()
          .custom((email) => Email.isValid(email)),
        password: Joi.string()
          .required()
          .custom((password) => Password.isValid(password)),
        role: Joi.string()
          .custom((role) => matchRoles(role))
          .default(defaultRole),
        isActive: Joi.boolean().default(true),
      },
    },
    { abortEarly: false }
  );

  public static requestToCommand = (request: Request): UpdateUserCommand => {
    const command = new UpdateUserCommand(
      request.params.id,
      request.body.email,
      request.body.password,
      request.body.role,
      request.body.isActive
    );

    return command;
  };
}

export default UpdateUserCommand;
