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

  static decodeToken(token: string, jwtOptions: IJWTTokenOptions) {
    return jwt.verify(token, jwtOptions.secret);
  }

  static getAccessToken(request: Request) {
    return request.cookies[accessTokenOptions.property];
  }

  static getRefreshToken(request: Request) {
    return request.cookies[refreshTokenOptions.property];
  }
}

export default JWTUtils;
