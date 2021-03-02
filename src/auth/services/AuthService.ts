import jwtOptions from "@app/configurations/jwtOptions";
import TYPES from "@shared/constants/TYPES";
import AppError from "@shared/errors/AppError";
import Permission from "@shared/types/Permission";
import Role from "@shared/types/Role";
import IProfileRepository from "@users/models/IProfileRepository";
import IUserRepository from "@users/models/IUserRepository";
import Profile from "@users/models/Profile";
import User from "@users/models/User";
import { StatusCodes } from "http-status-codes";
import { inject, injectable } from "inversify";
import { interfaces } from "inversify-express-utils";
import jwt from "jsonwebtoken";
import CustomPrincipal from "./CustomPrincipal";

interface IPayload {
  id: string;
  email: string;
  name: string;
  role: Role;
  isActive: boolean;
  // profile:	Profile page URL
  // picture:	Profile picture URL
  // nickname:	Casual name
}

interface IAuthInfo {
  isTokenValid: boolean;
  isTokenExpired?: boolean;
  token?: string;
  userId?: string;
  role?: Role;
  email?: string;
  isActive?: boolean;
  name?: string;
}

@injectable()
class AuthService {
  constructor(
    @inject(TYPES.IUserRepository) private userRepository: IUserRepository,
    @inject(TYPES.IProfileRepository)
    private profileRepository: IProfileRepository
  ) {}

  public getAuthInfoFromHeaderAuthorization = async (
    headerAuthorization: string | string[] | undefined
  ): Promise<IAuthInfo> => {
    if (typeof headerAuthorization !== "string")
      return this.notAuthenticateInfo();

    const bearerParts = headerAuthorization.split(" ");

    if (bearerParts.length !== 2 && bearerParts[0] !== "Bearer")
      return this.notAuthenticateInfo();

    const token = bearerParts[1] ?? "";

    if (!token || token.length == 0) return this.notAuthenticateInfo();

    const result = this.getPayloadFromToken(token);

    if (result != null) {
      if (result.isExpired) return this.expiredInfo(token, result.payload);
      return this.athenticateInfo(token, result.payload);
    }

    return this.notAuthenticateInfo();
  };

  public generateToken = async (
    user: User,
    profile: Profile
  ): Promise<string | null> => {
    const payload: IPayload = {
      id: user.id,
      email: user.email.value,
      name: profile.name,
      role: user.role,
      isActive: user.isActive,
    };

    try {
      const test = jwtOptions.notBefore;
      return Promise.resolve(
        jwt.sign(payload, jwtOptions.secret, {
          algorithm: jwtOptions.algorithm,
          expiresIn: jwtOptions.expiresIn,
          notBefore: jwtOptions.notBefore,
          issuer: jwtOptions.issuer,
          audience: jwtOptions.audience,
          subject: payload.id,
        })
      );
    } catch (e) {
      return Promise.resolve(null);
    }
  };

  public getUserProfile = async (
    authInfo: IAuthInfo
  ): Promise<Profile | null> => {
    if (!authInfo.isTokenValid) return null;
    const profile = await this.profileRepository.getById(authInfo.userId ?? "");
    return profile
      ? Promise.resolve(profile)
      : Promise.reject("Usuário não encontrado");
  };

  public throwUnauthorizedAppError = (): void => {
    throw new AppError("Você não está autenticado", StatusCodes.UNAUTHORIZED);
  };

  public throwForbiddenAppError = (): void => {
    throw new AppError(
      "Você não tem permissão para fazer isso",
      StatusCodes.FORBIDDEN
    );
  };

  public ensureAuthenticated = async (
    httpContext: interfaces.HttpContext
  ): Promise<void> => {
    if (!(await httpContext.user.isAuthenticated()))
      this.throwUnauthorizedAppError();
  };

  public ensureHasPermission = async (
    httpContext: interfaces.HttpContext,
    permission: Permission
  ): Promise<void> => {
    if (
      !(await (httpContext.user as CustomPrincipal).hasPermission(permission))
    )
      this.throwForbiddenAppError();
  };

  public ensureIsResourceOwner = async (
    httpContext: interfaces.HttpContext,
    ownerId: string
  ): Promise<void> => {
    if (!(await (httpContext.user as CustomPrincipal).isResourceOwner(ownerId)))
      this.throwForbiddenAppError();
  };

  public ensureIsResourceOwnerOrHasPermission = async (
    httpContext: interfaces.HttpContext,
    ownerId: string,
    permission: Permission
  ): Promise<void> => {
    if (
      !(await (httpContext.user as CustomPrincipal).isResourceOwner(ownerId)) &&
      !(await (httpContext.user as CustomPrincipal).hasPermission(permission))
    )
      this.throwForbiddenAppError();
  };

  public authInfo = (httpContext: interfaces.HttpContext): IAuthInfo =>
    httpContext.user.details as IAuthInfo;

  // #region TokenFunctions
  private getPayloadFromToken = (
    token: string
  ): { payload: IPayload; isExpired: boolean } | null => {
    try {
      const complete = this.tryVerifyToken(token);

      if (!this.isIPayload(complete.payload)) return null;

      return { payload: complete.payload as IPayload, isExpired: false };
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        try {
          const complete = this.tryDecodeToken(token);

          if (!this.isIPayload(complete.payload)) return null;

          return { payload: complete.payload as IPayload, isExpired: true };
        } catch {
          return null;
        }
      }
      return null;
    }
  };

  private tryVerifyToken = (
    token: string
  ): { payload: unknown; header: unknown; signature: unknown } => {
    return jwt.verify(token, jwtOptions.secret, {
      algorithms: [jwtOptions.algorithm],
      audience: jwtOptions.audience,
      issuer: jwtOptions.issuer,
      complete: true,
    }) as { payload: unknown; header: unknown; signature: unknown };
  };

  private tryDecodeToken = (
    token: string
  ): { payload: unknown; header: unknown; signature: unknown } => {
    return jwt.decode(token, {
      complete: true,
    }) as { payload: unknown; header: unknown; signature: unknown };
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private isIPayload = (data: any): data is IPayload => {
    return (
      data &&
      data.id &&
      data.email &&
      data.name &&
      data.role &&
      data.isActive &&
      typeof data.id === "string" &&
      typeof data.email === "string" &&
      typeof data.name === "string" &&
      typeof data.role === "string" &&
      typeof data.isActive === "boolean"
    );
  };
  // #endregion TokenFunctions

  // #region AuthInfoReturnFunctions
  private notAuthenticateInfo = (): IAuthInfo => ({
    isTokenValid: false,
  });

  private athenticateInfo = (token: string, payload: IPayload): IAuthInfo => ({
    isTokenValid: true,
    isTokenExpired: false,
    token: token,
    userId: payload.id,
    role: payload.role,
    email: payload.email,
    isActive: payload.isActive,
    name: payload.name,
  });

  private expiredInfo = (token: string, payload: IPayload): IAuthInfo => ({
    isTokenValid: true,
    isTokenExpired: true,
    token: token,
    userId: payload.id,
    role: payload.role,
    email: payload.email,
    isActive: payload.isActive,
    name: payload.name,
  });
  // #endregion AuthInfoReturnFunctions
}
export default AuthService;

export { IAuthInfo };
