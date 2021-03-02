import { Joi, Segments, celebrate } from "celebrate";
import { Request, RequestHandler } from "express";
import SupportedImageFormat, {
  supportedImageFormats,
} from "@images/types/SupportedImageFormat";

import Command from "@shared/messages/Command";

class CreateImagePathCommand extends Command {
  name: string;
  tags: string[];
  file: Express.Multer.File;
  changeFile = false;
  format?: SupportedImageFormat;
  quality?: number;
  size?: number;

  constructor(
    name: string,
    tags: string[],
    file: Express.Multer.File,
    changeFile = false,
    format?: SupportedImageFormat,
    quality?: number,
    size?: number
  ) {
    super();

    this.name = name;
    this.tags = tags;
    this.file = file;
    this.changeFile = changeFile;
    this.format = format;
    this.quality = quality;
    this.size = size;
  }

  public static validator: RequestHandler = celebrate(
    {
      [Segments.BODY]: {
        name: Joi.string().min(3).required(),
        tags: Joi.array().items(Joi.string()).required(),
        // changeFile: Joi.boolean().default(false).optional(),
        // format: Joi.string().allow(supportedImageFormats).optional(),
        quality: Joi.number().min(1).max(100).optional(),
        size: Joi.number().min(1).max(4096).optional(),
      },
    },
    { abortEarly: false }
  );

  public static requestToCommand = (
    request: Request
  ): CreateImagePathCommand => {
    const command = new CreateImagePathCommand(
      request.body.title,
      request.body.tags,
      request.file,
      request.body.changeFile,
      request.body.format,
      request.body.quality,
      request.body.size
    );
    return command;
  };
}

export default CreateImagePathCommand;
