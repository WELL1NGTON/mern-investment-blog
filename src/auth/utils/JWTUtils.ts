import {
  IJWTTokenOptions,
  accessTokenOptions,
  refreshTokenOptions,
} from "@auth/configurations/jwtTokenOptions";

import { Request } from "express";
import jwt from "jsonwebtoken";

class JWTUtils {
  static generateToken(
    payload: any,
    jwtOptions: IJWTTokenOptions
  ): string | null {
    try {
      return jwt.sign(payload, jwtOptions.secret, jwtOptions.signOptions);
    } catch (e) {
      return null;
    }
  }

  static decodeToken(
    token: string,
    jwtOptions: IJWTTokenOptions
  ): string | any {
    return jwt.verify(token, jwtOptions.secret);
  }

  static getAccessToken(request: Request): string {
    // TODO: find a better way of handling this
    if (typeof request.cookies[accessTokenOptions.property] !== "string")
      throw new Error();
    return request.cookies[accessTokenOptions.property];
  }

  static getRefreshToken(request: Request): string {
    // TODO: find a better way of handling this
    if (typeof request.cookies[refreshTokenOptions.property] !== "string")
      throw new Error();
    return request.cookies[refreshTokenOptions.property];
  }
}

export default JWTUtils;
