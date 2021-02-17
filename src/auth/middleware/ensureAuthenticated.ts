import { NextFunction, Request, Response } from "express";
import {
  accessTokenOptions,
  refreshTokenOptions,
} from "@auth/configurations/jwtTokenOptions";

import AppError from "@shared/errors/AppError";
import AuthData from "@auth/models/AuthData";
import JWTUtils from "@auth/utils/JWTUtils";
import { StatusCodes } from "http-status-codes";

const clearTokenAndRefuse = (response: Response) => {
  response.clearCookie(accessTokenOptions.property);
  response.clearCookie(refreshTokenOptions.property);
  throw new AppError("Você não está autenticado", StatusCodes.UNAUTHORIZED);
};

async function ensureAuthenticated(
  request: Request,
  response: Response,
  next: NextFunction
) {
  // TODO: está com algum problema ao gerar novo token a partir de refreshtoken
  const accessToken = JWTUtils.getAccessToken(request);

  // Check for token
  if (!accessToken) clearTokenAndRefuse(response);

  try {
    // Verify token
    let decodedAccess = JWTUtils.decodeToken(accessToken, accessTokenOptions);

    if (!decodedAccess) clearTokenAndRefuse(response);

    // Add user from payload
    request.body.auth = decodedAccess;

    next();
  } catch {
    const refreshToken = JWTUtils.getRefreshToken(request);

    if (!refreshToken) clearTokenAndRefuse(response);

    try {
      const decodedRefresh = JWTUtils.decodeToken(
        refreshToken,
        refreshTokenOptions
      );

      if (decodedRefresh instanceof AuthData) {
        const authData = new AuthData();

        authData.email = decodedRefresh.email;
        authData.role = decodedRefresh.role;

        const newToken = JWTUtils.generateToken(authData, accessTokenOptions);

        response.cookie(accessTokenOptions.property, newToken, {
          httpOnly: true,
        });

        next();
      } else {
        clearTokenAndRefuse(response);
      }
    } catch {
      clearTokenAndRefuse(response);
    }
  }
}

export default ensureAuthenticated;
