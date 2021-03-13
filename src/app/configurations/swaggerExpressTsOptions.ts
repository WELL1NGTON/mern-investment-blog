import {
  ISwaggerExpressOptions,
  SwaggerDefinitionConstant,
} from "swagger-express-ts";
import { articleStates, defaultArticleState } from "@shared/types/ArticleState";
import { defaultRole, roles } from "@shared/types/Role";

import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";
import { visibilities } from "@shared/types/Visibility";

/* eslint-disable @typescript-eslint/no-explicit-any */
const swaggerExpressTsOptions: ISwaggerExpressOptions = {
  definition: {
    info: {
      title: "Investment Blog API",
      version: "1.0",
      description: '"Simple" API for a blog',
    },
    externalDocs: {
      url: "localhost:5000/api/",
    },
    models: {
      // * Entity
      Entity: {
        description: "Base Entity.",
        properties: {
          id: {
            description: "Entity id",
            required: true,
            type: SwaggerDefinitionConstant.STRING,
            example: new mongoose.Types.ObjectId().toHexString() as any,
          },
        },
      },

      // * AppError
      AppError: {
        description: "Base Entity.",
        properties: {
          status: {
            description: "Status Message",
            required: true,
            type: SwaggerDefinitionConstant.STRING,
            example: "Error" as any,
          },
          message: {
            description: "Error Message",
            required: true,
            type: SwaggerDefinitionConstant.STRING,
            example: "Some error message" as any,
          },
        },
      },

      // * PagedResult
      PagedResult: {
        description: "PagedResult class with list of results from query.",
        properties: {
          list: {
            description: "Entities found",
            required: true,
            type: SwaggerDefinitionConstant.ARRAY,
            itemType: SwaggerDefinitionConstant.OBJECT,
            example: [
              '{\n"id":"6032591f206837819324d4b6",\n...\n}',
              '{\n"id":"6032592c61194a64b9fad3d0",\n...\n}',
              '{\n"id":"603259338ebca43e0973591b",\n...\n}',
            ] as any,
          },
          totalResults: {
            description: "Ammount of results found with the query parameters",
            required: false,
            type: SwaggerDefinitionConstant.NUMBER,
            example: Math.floor(Math.random() * 500) as any,
          },
          pageIndex: {
            description: "Page index that has the results",
            required: false,
            type: SwaggerDefinitionConstant.NUMBER,
            example: Math.floor(Math.random() * 19 + 1) as any,
          },
          pageSize: {
            description: "Ammount of results per page",
            required: false,
            type: SwaggerDefinitionConstant.NUMBER,
            example: 10 as any,
          },
          query: {
            description: "??????",
            required: false,
            type: SwaggerDefinitionConstant.STRING,
            example: "?????" as any,
          },
        },
      },

      // * Article
      Article: {
        description: "Article Model with all info.",
        properties: {
          id: {
            description: "Article id",
            required: true,
            type: SwaggerDefinitionConstant.STRING,
            example: new mongoose.Types.ObjectId().toHexString() as any,
          },
          slug: {
            description: "Article slug generated from title",
            required: true,
            type: SwaggerDefinitionConstant.STRING,
            example: "article-slug-1" as any,
          },
          title: {
            description: "Article title",
            required: true,
            type: SwaggerDefinitionConstant.STRING,
            example: "Article Title 1" as any,
          },
          description: {
            description: "Article's short description",
            required: true,
            type: SwaggerDefinitionConstant.STRING,
            example: "A short description of the article with some informations." as any,
          },
          markdownArticle: {
            description: "Article's main content as markdown",
            required: true,
            type: SwaggerDefinitionConstant.STRING,
            example: "#Markdown Title\n\nMain content of the article formated as markdown" as any,
          },
          date: {
            description: "Date when the Article was created",
            required: true,
            type: SwaggerDefinitionConstant.OBJECT,
            example: "2021-02-15T23:00:11.201Z" as any,
          },
          previewImg: {
            description: "Small image as preview for the Article",
            required: true,
            type: SwaggerDefinitionConstant.STRING,
            example: "localhost:5000/some_image_.jpg" as any,
          },
          tags: {
            description:
              "Some tags to facilitate users to find simillar Articles",
            required: true,
            type: SwaggerDefinitionConstant.ARRAY,
            example: ["Some tag", "Another tag", "Tag3.0"] as any,
          },
          category: {
            description: "Category",
            required: true,
            model: "Category",
          },
          author: {
            description: "Author",
            required: true,
            model: "Profile",
          },
          visibility: {
            description: "Inform to who it will appear",
            required: true,
            type: SwaggerDefinitionConstant.STRING,
            example: "ALL" as any,
            enum: visibilities as any,
          },
          state: {
            description: "Current state of the Article",
            required: true,
            type: SwaggerDefinitionConstant.STRING,
            example: defaultArticleState as any,
            enum: articleStates as any,
          },
        },
      },

      CreateUpdateArticle: {
        description: "Article Model with all info.",
        properties: {
          title: {
            description: "Article title",
            required: true,
            type: SwaggerDefinitionConstant.STRING,
            example: "Article Title 1" as any,
          },
          description: {
            description: "Article's short description",
            required: true,
            type: SwaggerDefinitionConstant.STRING,
            example: "A short description of the article with some informations." as any,
          },
          markdownArticle: {
            description: "Article's main content as markdown",
            required: true,
            type: SwaggerDefinitionConstant.STRING,
            example: "#Markdown Title\n\nMain content of the article formated as markdown" as any,
          },
          date: {
            description: "Date when the Article was created",
            required: true,
            type: SwaggerDefinitionConstant.OBJECT,
            example: "2021-02-15T23:00:11.201Z" as any,
          },
          previewImg: {
            description: "Small image as preview for the Article",
            required: true,
            type: SwaggerDefinitionConstant.STRING,
            example: "localhost:5000/some_image_.jpg" as any,
          },
          tags: {
            description:
              "Some tags to facilitate users to find simillar Articles",
            required: true,
            type: SwaggerDefinitionConstant.ARRAY,
            example: ["Some tag", "Another tag", "Tag3.0"] as any,
          },
          category: {
            description: "Category id",
            required: true,
            type: SwaggerDefinitionConstant.STRING,
            example: new mongoose.Types.ObjectId().toHexString() as any,
          },
          author: {
            description: "Author id",
            required: true,
            type: SwaggerDefinitionConstant.STRING,
            example: new mongoose.Types.ObjectId().toHexString() as any,
          },
          visibility: {
            description: "Inform to who it will appear",
            required: true,
            type: SwaggerDefinitionConstant.STRING,
            example: "ALL" as any,
            enum: visibilities as any,
          },
          state: {
            description: "Current state of the Article",
            required: true,
            type: SwaggerDefinitionConstant.STRING,
            example: defaultArticleState as any,
            enum: articleStates as any,
          },
        },
      },

      // * Category
      Category: {
        description:
          "Category Model class wich group Articles for better organization.",
        properties: {
          id: {
            description: "Category id",
            required: true,
            type: SwaggerDefinitionConstant.STRING,
            example: new mongoose.Types.ObjectId().toHexString() as any,
          },
          name: {
            description: "Category name",
            required: true,
            type: SwaggerDefinitionConstant.STRING,
            example: "Category 1" as any,
          },
          visibility: {
            description: "Inform to who it will appear",
            required: true,
            type: SwaggerDefinitionConstant.STRING,
            example: "ALL" as any,
            enum: visibilities as any,
          },
          color: {
            description: "Description color in hex rpg (#hhhhhh)",
            required: true,
            type: SwaggerDefinitionConstant.STRING,
            example: "#3a558c" as any,
          },
        },
      },

      CreateUpdateCategory: {
        description:
          "Category Model class wich group Articles for better organization.",
        properties: {
          name: {
            description: "Category name",
            required: true,
            type: SwaggerDefinitionConstant.STRING,
            example: "Category 1" as any,
          },
          visibility: {
            description: "Inform to who it will appear",
            required: true,
            type: SwaggerDefinitionConstant.STRING,
            example: "ALL" as any,
            enum: visibilities as any,
          },
          color: {
            description: "Description color in hex rpg (#hhhhhh)",
            required: true,
            type: SwaggerDefinitionConstant.STRING,
            example: "#3a558c" as any,
          },
        },
      },

      // * Image
      ImagePath: {
        description:
          "ImagePath Model class wich group Articles for better organization.",
        properties: {
          id: {
            description: "ImagePath id",
            required: true,
            type: SwaggerDefinitionConstant.STRING,
            example: new mongoose.Types.ObjectId().toHexString() as any,
          },
          name: {
            description: "ImagePath name",
            required: true,
            type: SwaggerDefinitionConstant.STRING,
            example: "ImagePath 1" as any,
          },
          slug: {
            description: "ImagePath slug generated from name",
            required: true,
            type: SwaggerDefinitionConstant.STRING,
            example: "imagepath-1" as any,
          },
          tags: {
            description:
              "Some tags to facilitate writers to find simillar Images",
            required: true,
            type: SwaggerDefinitionConstant.ARRAY,
            example: ["Some tag", "Another tag", "Tag3.0"] as any,
          },
          url: {
            description: "ImagePath url generated by firebase firestore",
            required: true,
            type: SwaggerDefinitionConstant.STRING,
            example: "https://firebasestorage.googleapis.com/v0/b/{storageBucketName}.appspot.com/o/{image-file-name.jpg}?alt=media&token={downloadToken}" as any,
          },
          bucket: {
            description: "Firebase storage bucket",
            required: true,
            type: SwaggerDefinitionConstant.STRING,
            example: "{storageBucketName}.appspot.com" as any,
          },
          firebaseFileName: {
            description: "File name saved on Firebase Storage",
            required: true,
            type: SwaggerDefinitionConstant.STRING,
            example: "{storageBucketName}.appspot.com" as any,
          },
          firebaseStorageDownloadTokens: {
            description: "Token to access the image",
            required: true,
            type: SwaggerDefinitionConstant.STRING,
            example: uuidv4() as any,
          },
          uploadedBy: {
            description: "Id of the writer that uploaded the file",
            required: true,
            type: SwaggerDefinitionConstant.STRING,
            example: new mongoose.Types.ObjectId().toHexString() as any,
          },
        },
      },

      UploadImage: {
        description: "UploadImagesModel",
        properties: {
          // name: {
          //   description: "Category name",
          //   required: true,
          //   type: SwaggerDefinitionConstant.STRING,
          //   example: "Category 1" as any,
          // },
          // visibility: {
          //   description: "Inform to who it will appear",
          //   required: true,
          //   type: SwaggerDefinitionConstant.STRING,
          //   example: "ALL" as any,
          //   enum: visibilities as any,
          // },
          // color: {
          //   description: "Description color in hex rpg (#hhhhhh)",
          //   required: true,
          //   type: SwaggerDefinitionConstant.STRING,
          //   example: "#3a558c" as any,
          // },
          parameters: {
            description: `in: "formData", name: "file", type: "file" description: "image to be uploaded"`,
          },
        },
      },

      // * Profile
      Profile: {
        description: "Profile Model class with users information.",
        properties: {
          id: {
            description: "Profile id",
            required: true,
            type: SwaggerDefinitionConstant.STRING,
            example: new mongoose.Types.ObjectId().toHexString() as any,
          },
          name: {
            description: "User name",
            required: true,
            type: SwaggerDefinitionConstant.STRING,
            example: "Wellington" as any,
          },
          profileImage: {
            description: "Some image uri",
            required: false,
            type: SwaggerDefinitionConstant.STRING,
            example: "http://localhost:5000/some-imagem.jpg" as any,
          },
          contact: {
            description:
              "Array of tuples[string,string] with index 0 beying some type of contact and index 1 beying the contact information",
            required: false,
            type: SwaggerDefinitionConstant.ARRAY,
            example: [
              ["Email", "abcdef@test.com.br"],
              ["Facebook", "url_facebook"],
            ] as any,
          },
        },
      },

      UpdateProfile: {
        description: "Profile Model class with users information.",
        properties: {
          name: {
            description: "User name",
            required: true,
            type: SwaggerDefinitionConstant.STRING,
            example: "Wellington" as any,
          },
          profileImage: {
            description: "Some image uri",
            required: false,
            type: SwaggerDefinitionConstant.STRING,
            example: "http://localhost:5000/some-imagem.jpg" as any,
          },
          contact: {
            description:
              "Array of tuples[string,string] with index 0 beying some type of contact and index 1 beying the contact information",
            required: false,
            type: SwaggerDefinitionConstant.ARRAY,
            example: [
              ["Email", "abcdef@test.com.br"],
              ["Facebook", "url_facebook"],
            ] as any,
          },
        },
      },

      // * User
      User: {
        description: "User Model.",
        properties: {
          id: {
            description: "User id",
            required: true,
            type: SwaggerDefinitionConstant.STRING,
            example: new mongoose.Types.ObjectId().toHexString() as any,
          },
          email: {
            description: "User email",
            required: true,
            type: SwaggerDefinitionConstant.STRING,
            example: "user-email-1234@email.com.br" as any,
          },
          password: {
            description: "User Password",
            required: true,
            type: SwaggerDefinitionConstant.STRING,
            example: "*****************" as any,
          },
          role: {
            description: "User Role",
            required: true,
            type: SwaggerDefinitionConstant.STRING,
            enum: roles as any,
            example: defaultRole as any,
          },
          isActive: {
            description: "Some image uri",
            required: true,
            type: SwaggerDefinitionConstant.BOOLEAN,
            example: true as any,
          },
        },
      },

      UpdateUser: {
        description: "User Model.",
        properties: {
          email: {
            description: "User email",
            required: true,
            type: SwaggerDefinitionConstant.STRING,
            example: "user-email-1234@email.com.br" as any,
          },
          password: {
            description: "User Password",
            required: true,
            type: SwaggerDefinitionConstant.STRING,
            example: "*****************" as any,
          },
          role: {
            description: "User Role",
            required: true,
            type: SwaggerDefinitionConstant.STRING,
            enum: roles as any,
            example: defaultRole as any,
          },
          isActive: {
            description: "Some image uri",
            required: true,
            type: SwaggerDefinitionConstant.BOOLEAN,
            example: true as any,
          },
        },
      },

      CreateUserAndProfile: {
        description: "User Model.",
        properties: {
          name: {
            description: "User name",
            required: true,
            type: SwaggerDefinitionConstant.STRING,
            example: "Wellington" as any,
          },
          email: {
            description: "User email",
            required: true,
            type: SwaggerDefinitionConstant.STRING,
            example: "user-email-1234@email.com.br" as any,
          },
          password: {
            description: "User Password",
            required: true,
            type: SwaggerDefinitionConstant.STRING,
            example: "*****************" as any,
          },
          role: {
            description: "User Role",
            required: true,
            type: SwaggerDefinitionConstant.STRING,
            enum: roles as any,
            example: defaultRole as any,
          },
          isActive: {
            description: "Some image uri",
            required: true,
            type: SwaggerDefinitionConstant.BOOLEAN,
            example: true as any,
          },
        },
      },

      // * Login
      Login: {
        description: "Login Model.",
        properties: {
          email: {
            description: "User email",
            required: true,
            type: SwaggerDefinitionConstant.STRING,
            example: "user-email-1234@email.com.br" as any,
          },
          password: {
            description: "User Password",
            required: true,
            type: SwaggerDefinitionConstant.STRING,
            example: "*****************" as any,
          },
        },
      },

      // * RefreshToken
      RefreshToken: {
        description: "RefreshToken Model.",
        properties: {
          refreshToken: {
            description: "Refresh Token",
            required: true,
            type: SwaggerDefinitionConstant.STRING,
            example: uuidv4() as any,
          },
        },
      },

      // * LoginSuccess
      LoginSuccess: {
        description: "User Successfully Authenticated Model.",
        properties: {
          accessToken: {
            description: "JWT Token",
            required: true,
            type: SwaggerDefinitionConstant.STRING,
            example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IldlbGxpbmd0b24iLCJpYXQiOjE1MTYyMzkwMjJ9.1n-CudqOoUwB4eD40hZarsARxTbFUq4ZF_h5bDLJr5A" as any,
          },
          refreshToken: {
            description: "Refresh Token (Guid)",
            required: true,
            type: SwaggerDefinitionConstant.STRING,
            example: uuidv4() as any,
          },
          user: {
            description: "User",
            model: "User",
          },
        },
      },

      // * AuthDetails
      AuthDetails: {
        description: "Login Model.",
        properties: {
          isTokenValid: {
            description: "JWT Token Is Valid",
            required: true,
            type: SwaggerDefinitionConstant.BOOLEAN,
            example: true as any,
          },
          isTokenExpired: {
            description: "JWT Token Is Expired",
            required: true,
            type: SwaggerDefinitionConstant.BOOLEAN,
            example: false as any,
          },
          token: {
            description: "JWT Token",
            required: true,
            type: SwaggerDefinitionConstant.STRING,
            example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IldlbGxpbmd0b24iLCJpYXQiOjE1MTYyMzkwMjJ9.1n-CudqOoUwB4eD40hZarsARxTbFUq4ZF_h5bDLJr5A" as any,
          },
          userId: {
            description: "User Id",
            required: true,
            type: SwaggerDefinitionConstant.STRING,
            example: "1234567890abcdef" as any,
          },
          role: {
            description: "User Role",
            required: true,
            type: SwaggerDefinitionConstant.STRING,
            example: "USER" as any,
          },
          email: {
            description: "User email",
            required: true,
            type: SwaggerDefinitionConstant.STRING,
            example: "user-email-1234@email.com.br" as any,
          },
          isActive: {
            description: "User Account is Active",
            required: true,
            type: SwaggerDefinitionConstant.BOOLEAN,
            example: true as any,
          },
          name: {
            description: "User Name",
            required: true,
            type: SwaggerDefinitionConstant.STRING,
            example: "User Name Da Silva" as any,
          },
        },
      },

      ChangePassword: {
        description: "Login Model.",
        properties: {
          oldPassword: {
            description: "User Password",
            required: true,
            type: SwaggerDefinitionConstant.STRING,
            example: "*****************" as any,
          },
          newPassword: {
            description: "User Password",
            required: true,
            type: SwaggerDefinitionConstant.STRING,
            example: "*****************" as any,
          },
        },
      },
    },
    // TODO: Configurar a porcaria da autorização!
    securityDefinitions: {
      ["Bearer"]: {
        type: SwaggerDefinitionConstant.Security.Type.API_KEY,
        in: SwaggerDefinitionConstant.Security.In.HEADER,
        name: "Authorization",
      },
    },
  },
};

export default swaggerExpressTsOptions;
