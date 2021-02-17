import { SignOptions } from "jsonwebtoken";

export interface IJWTTokenOptions {
  secret: string;
  signOptions: SignOptions;
  property: string;
}

export const accessTokenOptions: IJWTTokenOptions = {
  secret: process.env.ACCESS_TOKEN_SECRET as string,
  signOptions: {
    expiresIn: process.env.ACCESS_TOKEN_EXPIRATION_TIME as string,
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
