import { Joi, Segments, celebrate } from "celebrate";
import { Request, RequestHandler } from "express";
import Visibility, {
  defaultVisibility,
  matchVilibilities,
} from "@shared/types/Visibility";

import Color from "@shared/richObjects/Color";
import Command from "@shared/messages/Command";
import Entity from "@shared/models/Entity";
import { isValidObjectId } from "mongoose";

class UpdateCategoryCommand extends Command {
  id: string;
  name: string;
  visibility: Visibility;
  color: string;

  constructor(id: string, name: string, visibility: Visibility, color: string) {
    super();

    this.name = name;
    this.color = color;
    this.visibility = visibility;
  }

  public static validator: RequestHandler = celebrate(
    {
      [Segments.PARAMS]: {
        id: Joi.string()
          .required()
          .custom((id) => isValidObjectId(id)),
      },
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
  ): UpdateCategoryCommand => {
    const command = new UpdateCategoryCommand(
      request.params.id,
      request.body.name,
      request.body.visibility,
      request.body.color
    );

    return command;
  };
}

export default UpdateCategoryCommand;
