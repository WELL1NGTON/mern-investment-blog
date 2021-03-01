import { SignOptions } from "jsonwebtoken";

// algorithm?: Algorithm;
// keyid?: string;
// /** expressed in seconds or a string describing a time span [zeit/ms](https://github.com/zeit/ms.js).  Eg: 60, "2 days", "10h", "7d" */
// expiresIn?: string | number;
// /** expressed in seconds or a string describing a time span [zeit/ms](https://github.com/zeit/ms.js).  Eg: 60, "2 days", "10h", "7d" */
// notBefore?: string | number;
// audience?: string | string[];
// subject?: string;
// issuer?: string;
// jwtid?: string;
// mutatePayload?: boolean;
// noTimestamp?: boolean;
// header?: object;
// encoding?: string;

export interface IJWTTokenOptions {
  secret: string;
  signOptions: SignOptions;
  property: string;
}

export const accessTokenOptions: IJWTTokenOptions = {
  secret: process.env.ACCESS_TOKEN_SECRET as string,
  signOptions: {
    algorithm: "HS256",
    expiresIn: process.env.ACCESS_TOKEN_EXPIRATION_TIME as string,
    notBefore: Date.now(),
    issuer: `https:\\\\${process.env.HOST as string}:${
      process.env.PORT as string
    }`,
    audience: `https:\\\\${process.env.HOST as string}:${
      process.env.PORT as string
    }`,
    // subject: userid
  } as SignOptions,
  property: "access-token",
};

export const refreshTokenOptions: IJWTTokenOptions = {
  secret: process.env.REFRESH_TOKEN_SECRET as string,
  signOptions: {
    expiresIn: process.env.REFRESH_TOKEN_EXPIRATION_TIME as string,
  } as SignOptions,
  property: "refresh-token",
};

export const emailTokenOptions: IJWTTokenOptions = {
  secret: process.env.EMAIL_TOKEN_SECRET as string,
  signOptions: {
    expiresIn: process.env.EMAIL_TOKEN_EXPIRATION_TIME as string,
  } as SignOptions,
  property: "",
};
