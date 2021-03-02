import AppError from "@shared/errors/AppError";
import { StatusCodes } from "http-status-codes";
import { Storage } from "@google-cloud/storage";
import fs from "fs";
import googleCloudOptions from "@app/configurations/googleCloudOptions";
import sharp from "sharp";
import slugify from "slugify";
import { v4 as uuidv4 } from "uuid";

interface IImageCompressOptions {
  file: Express.Multer.File;
  format?: "jpg" | "jpeg" | "png" | "webp" | "" | string;
  quality?: number;
  size?: number;
}

export default async function (
  imageCompressOptions: IImageCompressOptions,
  bucketName = googleCloudOptions.googleBucketName || ""
): Promise<{
  url: string;
  firebaseStorageDownloadTokens: string;
  firebaseFileName: string;
  bucket: string;
}> {
  // Compress the file sent by the user
  // let path;
  // if (imageCompressOptions.format || imageCompressOptions.format !== '')
  //   path = await generateNewCompressedFile(imageCompressOptions);
  // else
  //   path = imageCompressOptions.file.path;

  const path = await generateNewCompressedFile(imageCompressOptions);

  // Creates a "client" for firebase storage
  const storage = new Storage();

  // Generating a token to access the image without needing to use a google account
  const token = uuidv4();

  try {
    // Upload file to firebase storage bucket
    const uploadedImage = await storage.bucket(bucketName).upload(path, {
      gzip: true,
      metadata: {
        cacheControl: "public, max-age=31536000",
        metadata: {
          firebaseStorageDownloadTokens: token, //https://stackoverflow.com/questions/59432624/how-can-i-generate-access-token-to-file-uploaded-to-firebase-storage
        },
      },
    });

    // 'Gambiarra' checking if uploaded was done right so the url can be configured
    let url = "";
    if (typeof uploadedImage[0].baseUrl !== "undefined")
      // Formating url from the returned 'storage.googleapis.com' to an usable 'firebasestorage.googleapis.com'
      url = `https://firebasestorage.googleapis.com/v0${uploadedImage[0].bucket.baseUrl}/${uploadedImage[0].bucket.name}${uploadedImage[0].baseUrl}/${uploadedImage[0].name}?alt=media&token=${uploadedImage[0].metadata.metadata["firebaseStorageDownloadTokens"]}`;

    // Returning object with url formated (or empty string in case of file not sent)
    // TODO: Verificar se erro no envio gera exception ou se a gambiarra funciona
    return {
      url,
      firebaseStorageDownloadTokens: token,
      firebaseFileName: uploadedImage[0].name,
      bucket: uploadedImage[0].bucket.name,
    };
  } catch (e) {
    throw new AppError(e.message, StatusCodes.INTERNAL_SERVER_ERROR);
  } finally {
    deleteFile(path);
  }
}

const generateNewCompressedFile = async (
  imageCompressOptions: IImageCompressOptions
) => {
  // Compress data and put on buffer
  const data = await compressImage(imageCompressOptions);

  // Delete file sent by user
  await deleteFile(imageCompressOptions.file.path);

  // Configure a new path to save the file on buffer
  const newPath = generateNewFilePathName(
    imageCompressOptions.file.path,
    imageCompressOptions.format
  );

  // Save the file on buffer to new path
  await saveNewFileFromBuffer(newPath, data);

  // return compressed file path
  return newPath;
};

const compressImage = async ({
  file,
  format,
  quality = 90,
  size,
}: IImageCompressOptions) => {
  let data: Buffer;

  // Compress and change file format to selected format
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

  return data;
};

const generateNewFilePathName = (originalPath: string, format?: string) => {
  // Get only the filename
  const oldFilename = originalPath.replace(/^.*[\\/]/, "");
  let newFilename = oldFilename;

  // Change the file extension
  const dots = newFilename.split(".");
  if (typeof format !== "undefined" && format !== "")
    dots[dots.length - 1] = format;
  newFilename = dots.join(".");

  // Transform the file name in a slug
  newFilename = slugify(newFilename, { lower: true });

  // Replace old file name in path to new filename
  const newPath = originalPath.replace(oldFilename, newFilename);

  return newPath;
};

const deleteFile = async (path: string) => {
  // Check if the file is accessible
  await fs.access(path, (err) => {
    if (!err) {
      // Delete the file
      fs.unlink(path, (err) => {
        if (err)
          throw new AppError(err.message, StatusCodes.INTERNAL_SERVER_ERROR);
      });
    } else {
      throw new AppError(err.message, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  });
};

const saveNewFileFromBuffer = async (path: string, data: Buffer) => {
  // create new file from buffer data
  await fs.writeFile(path, data, (err) => {
    if (err) {
      throw new AppError(err.message, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  });
};
