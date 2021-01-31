import Image, { IImage } from "@shared/models/image.model";

import compressImage from "@shared/util/fileHelper";
import firebase from "firebase";
import googleStorage from '@google-cloud/storage';
import storage from "firebase/storage";

// import ImagePath, { IImagePath } from "@shared/models/imagePath.model";


// interface IRequest {
//   file: Express.Multer.File;
//   protocol: string;
//   host: string;
//   userId: string;
//   tags: string[];
//   size?: number | null;
// }
// interface IResponse {
//   message: string;
//   image: IImagePath;
// }

// class UploadImageService {
//   public async execute({
//     file,
//     protocol,
//     host,
//     userId,
//     tags = [],
//     size = null,
//   }: IRequest): Promise<IResponse> {
//     const newPath = await compressImage(file, size);
//     // return res.status(500).json("Error on file processing.");
//     const newFileName = newPath.replace(/^.*[\\\/]/, "");
//     const url = `${protocol}://${host}/images/${newFileName}`;
//     const newImagePath: IImagePath = new ImagePath({
//       name: newFileName,
//       path: newPath,
//       url: url,
//       articles: [],
//       tags,
//       user: userId,
//     });

//     const savedImagePath = await newImagePath.save();

//     return {
//       message: "",
//       image: savedImagePath,
//     };
//   }
// }

interface IRequest {
  file: Express.Multer.File;
  uploadedBy: string;
  name: string;
  tags: string[];
  format?: "jpg" | "jpeg" | "png" | "webp";
  quality?: number;
  size?: number;
}
interface IResponse {
  message: string;
  image: IImage;
}

class UploadImageService {
  public async execute({
    file,
    name,
    tags,
    quality,
    format = "jpg",
    size,
    uploadedBy,
  }: IRequest): Promise<IResponse> {
    await sendToFirebaseStorage2(file.path);

    const buffer = await compressImage(file, format, quality, size);

    const newImage: IImage = new Image({
      name: `${name}.${format}`,
      tags,
      // image: buffer,
      binData: { data: buffer, contentType: "image/" + format },
      uploadedBy,
      url: "aaaaaaaaaaaaaa"
    });



    const savedImage = await newImage.save();

    return {
      message: "",
      image: savedImage,
    };
  }
}

export default UploadImageService;


const sendToFirebaseStorage = (buffer: Buffer) => {

  // const firebaseConfig = {
  //   apiKey: "AIzaSyDbcZUH-h3zq33zhHGJOPwwONOJ6vU2Z1Y",
  //   authDomain: "investmentblogtest.firebaseapp.com",
  //   databaseURL: "https://investmentblogtest-default-rtdb.firebaseio.com",
  //   projectId: "investmentblogtest",
  //   storageBucket: "investmentblogtest.appspot.com",
  //   messagingSenderId: "252890406177",
  //   appId: "1:252890406177:web:230dec1524912cf934b260"
  // };

  // const initialized = firebase.initializeApp(firebaseConfig);

  // // const storage = initialized.storage();

  // // var config = {
  // //   projectId: "investmentblogtest",
  // //   keyFilename: "./investmentBlogTest-a950b3cff6cb.json"
  // // }
  // // var storage = require('@google-cloud/storage');

  // const storage = new googleStorage({
  //   projectId: "investmentblogtest",
  //   keyFilename: "./investmentBlogTest-a950b3cff6cb.json"
  // });

  // const bucket = storage.bucket("investmentblogtest.appspot.com");

  // // const result = await bucket.ref("/").put(buffer);

  // let fileUpload = bucket.file(buffer);

  // const blobStream = fileUpload.createWriteStream({
  //   metadata: {
  //     contentType: file.mimetype
  //   }
  // });

  // blobStream.on('finish', () => {
  //   // The public URL can be used to directly access the file via HTTP.
  //   const url = `https://storage.googleapis.com/${bucket.name}/${fileUpload.name}`;
  //   console.log(url);
  // });

  // blobStream.end(file.buffer);

  // // blobStream.on('error', (error) => {
  // //   reject('Something is wrong! Unable to upload at the moment.');
  // // });

  const { Storage } = require('@google-cloud/storage');

  // Creates a client
  const storage = new Storage();
  // Creates a client from a Google service account key.
  // const storage = new Storage({keyFilename: "key.json"});

  /**
   * TODO(developer): Uncomment these variables before running the sample.
   */
  // const bucketName = 'bucket-name';

  async function createBucket() {
    // Creates the new bucket
    await storage.createBucket("investmentblogtest.appspot.com");
    console.log(`Bucket ${"investmentblogtest.appspot.com"} created.`);
  }

  createBucket().catch(console.error);


  // console.log(buffer);


  // newImage.url = await result.ref.getDownloadURL();

  // newImage.image.data = buffer;

  return "";
};


const sendToFirebaseStorage2 = async (filename = './local/path/to/file.txt') => {
  const { Storage } = require('@google-cloud/storage');

  const storage = new Storage();

  async function uploadFile() {
    const test = await storage.bucket("investmentblogtest.appspot.com").upload(filename, {
      gzip: true,
      metadata: {
        cacheControl: 'public, max-age=31536000',
      },
    });

    console.log(test);

    return test;

    console.log(`${filename} uploaded to ${"investmentblogtest.appspot.com"}.`);
  }

  return await uploadFile().catch(console.error);
};
