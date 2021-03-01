import { Joi, Segments, celebrate } from "celebrate";
import { Request, RequestHandler } from "express";
import Role, { defaultRole, matchRoles } from "@shared/types/Role";

import Command from "@shared/messages/Command";
import Email from "@shared/valueObjects/Email";
import Password from "@shared/valueObjects/Password";

class CreateUserAndProfileCommand extends Command {
  // When the user is created, a name is needed so I can create an "empty" profile for him
  name: string;
  email: string;
  password: string;
  role: Role;
  isActive: boolean;

  constructor(
    name: string,
    email: string,
    password: string,
    role: Role,
    isActive: boolean
  ) {
    super();

    this.name = name;
    this.email = email;
    this.password = password;
    this.role = role;
    this.isActive = isActive;
  }

  public static validator: RequestHandler = celebrate(
    {
      [Segments.BODY]: {
        name: Joi.string().required().min(3),
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

  public static requestToCommand = (
    request: Request
  ): CreateUserAndProfileCommand => {
    const command = new CreateUserAndProfileCommand(
      request.body.name,
      request.body.email,
      request.body.password,
      request.body.role,
      request.body.isActive
    );

    return command;
  };
}

export default CreateUserAndProfileCommand;
