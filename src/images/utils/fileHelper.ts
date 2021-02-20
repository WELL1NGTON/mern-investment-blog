import SupportedImageFormat, {
  defaultImageFormat,
} from "@images/types/SupportedImageFormat";

import AppError from "@shared/errors/AppError";
import { StatusCodes } from "http-status-codes";
import fs from "fs";
import sharp from "sharp";

export default async (
  file: Express.Multer.File,
  format: SupportedImageFormat = defaultImageFormat,
  quality = 80,
  size?: number
): Promise<Buffer> => {
  let data: Buffer;
  switch (format) {
    case "jpeg":
    case "jpg":
      data = await sharp(file.path)
        .resize(size)
        .toFormat("jpeg")
        .jpeg({ quality })
        .toBuffer();
      break;

    case "png":
      data = await sharp(file.path)
        .resize(size)
        .toFormat(format)
        .png({ quality })
        .toBuffer();
      break;

    case "webp":
      data = await sharp(file.path)
        .resize(size)
        .toFormat(format)
        .webp({ quality })
        .toBuffer();
      break;

    default:
      data = await sharp(file.path).toBuffer();
      break;
  }

  fs.unlink(file.path, (err) => {
    if (err) console.log(err);
  });

  if (!data) {
    throw new AppError(
      "Erro ao comprimir/converter a imagem",
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }

  return data;
};
