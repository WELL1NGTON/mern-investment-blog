import { Algorithm, Secret } from "jsonwebtoken";

const secret: Secret = process.env.JWT_SECRET as string;

const algorithm: Algorithm = (process.env.JWT_ALGORITHM ??
  "HS256") as Algorithm;

const jwtOptions = Object.freeze({
  secret,
  expiresIn: process.env.JWT_EXPIRES_IN ?? "15m",
  algorithm,
  issuer: `https://${process.env.HOST ?? "localhost"}:${
    process.env.PORT ?? 5000
  }`,
  audience: `https://${process.env.HOST ?? "localhost"}:${
    process.env.PORT ?? 5000
  }`,
  notBefore: process.env.JWT_NOT_BEFORE ?? "0s",
});

export default jwtOptions;
