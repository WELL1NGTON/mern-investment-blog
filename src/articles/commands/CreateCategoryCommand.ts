import { Joi, Segments, celebrate } from "celebrate";
import { Request, RequestHandler } from "express";
import Visibility, {
  defaultVisibility,
  matchVilibilities,
} from "@shared/types/Visibility";

import Color from "@shared/valueObjects/Color";
import Command from "@shared/messages/Command";

class CreateCategoryCommand extends Command {
  name: string;
  visibility: Visibility;
  color: string;

  constructor(name: string, visibility: Visibility, color: string) {
    super();

    this.name = name;
    this.color = color;
    this.visibility = visibility;
  }

  public static validator: RequestHandler = celebrate(
    {
      [Segments.BODY]: {
        name: Joi.string().min(3).required(),
        visibility: Joi.string()
          .custom((visibility) => matchVilibilities(visibility))
          .default(defaultVisibility),
        description: Joi.string().custom((color) => Color.isValid(color)),
      },
    },
    { abortEarly: false }
  );

  public static requestToCommand = (
    request: Request
  ): CreateCategoryCommand => {
    const command = new CreateCategoryCommand(
      request.body.name,
      request.body.visibility,
      request.body.color
    );

    return command;
  };
}

export default CreateCategoryCommand;
