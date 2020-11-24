import AppError from "@shared/errors/AppError";
import fs from "fs";
import sharp from "sharp";
import StatusCodes from "http-status-codes";

const { INTERNAL_SERVER_ERROR } = StatusCodes;

// const compressImage = (
//   file: Express.Multer.File,
//   size: number | null = null
// ) => {
//   const newPath = file.path.split(".")[0] + ".jpg";
//   return sharp(file.path)
//     .resize(size)
//     .toFormat("jpg")
//     .jpeg({ quality: 80 })
//     .toBuffer()
//     .then((data) => {
//       fs.access(file.path, (err) => {
//         if (!err) {
//           // console.log(file.path);
//           fs.unlink(file.path, (err) => {
//             if (err) console.log(err);
//           });
//         } else {
//           console.log(err);
//         }
//         fs.writeFile(newPath, data, (err) => {
//           if (err) {
//             throw err;
//           }
//         });
//       });

//       return newPath;
//     });
// };

const compressImage = async (
  file: Express.Multer.File,
  format: "jpg" | "jpeg" | "png" | "webp" = "jpg",
  quality: number = 80,
  size?: number
) => {
  // const newPath = file.path.split(".")[0] + ".jpg";

  let data: Buffer;
  switch (format) {
    case "jpeg":
    case "jpg":
      data = await sharp(file.path)
        .resize(size)
        .toFormat(format)
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
  }

  fs.unlink(file.path, (err) => {
    if (err) console.log(err);
  });

  if (!data) {
    throw new AppError(
      "Erro ao comprimir/converter a imagem",
      INTERNAL_SERVER_ERROR
    );
  }

  return data;
};

export { compressImage };
