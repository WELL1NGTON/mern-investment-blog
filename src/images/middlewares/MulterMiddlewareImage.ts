import { BaseMiddleware } from "inversify-express-utils";
import { Request } from "express";
import { injectable } from "inversify";
import multer from "multer";

@injectable()
class MulterMiddlewareImage extends BaseMiddleware {
  public handler = multer({
    storage: multer.diskStorage({
      destination: (req: Request, file: Express.Multer.File, cb) => {
        cb(null, "./public/images");
      },

      filename: (req: Request, file: Express.Multer.File, cb) => {
        cb(null, Date.now().toString() + "-" + file.originalname);
      },
    }),
    fileFilter: (req: Request, file: Express.Multer.File, cb) => {
      const isAccepted = ["image/png", "image/jpg", "image/jpeg"].find(
        (formatoAceito) => formatoAceito == file.mimetype
      );
      if (isAccepted) {
        return cb(null, true);
      }
      return cb(null, false);
    },
  }).single("image");
}

export default MulterMiddlewareImage;
