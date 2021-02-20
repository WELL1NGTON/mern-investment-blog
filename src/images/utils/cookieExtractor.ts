import { Request } from "express";

const extractJWTTokens = (
  req: Request
): {
  accessToken: string | null;
  refreshToken: string | null;
} => {
  let accessToken = null;
  let refreshToken = null;
  if (req && req.cookies) {
    accessToken = <string>req.cookies["access-token"];
    refreshToken = <string>req.cookies["refresh-token"];
  }
  return { accessToken, refreshToken };
};

export { extractJWTTokens };
