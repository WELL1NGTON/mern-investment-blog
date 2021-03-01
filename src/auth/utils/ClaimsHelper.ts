// https://tools.ietf.org/html/rfc7519
// https://www.iana.org/assignments/jwt/jwt.xhtml#claims

import Permission from "@shared/types/Permission";
import User from "@users/models/User";
import { v4 as uuidv4 } from "uuid";

interface IClaim {
  // Reserved claims
  iss: string; // (issuer): Issuer of the JWT
  sub: string; // (subject): Subject of the JWT (the user)
  aud: string; // (audience): Recipient for which the JWT is intended
  exp: number; // (expiration time): Time after which the JWT expires
  nbf: number; // (not before time): Time before which the JWT must not be accepted for processing
  iat: number; // (issued at time): Time at which the JWT was issued; can be used to determine age of the JWT
  jti: string; // (JWT ID): Unique identifier; can be used to prevent the JWT from being replayed (allows a token to be used only once)

  // iana
  nickname: string;
  permissions: Permission[];
}

class ClaimsHelper {
  public generateUserClaims(user: User): IClaim {
    // TODO: Fix issuer/audience
    const iss = "InvestmentBlog";
    const aud = "InvestmentBlog";
    const sub = user.id;
    const exp = Date.now() + 7 * 24 * 60 * 60 * 1000; // dias,horas,minutos,segundos,millisegundos
    const nbf = Date.now();
    const iat = Date.now();
    const jti = uuidv4();

    nickname;
    return { iss } as IClaim;
  }
}

export default ClaimsHelper;

export { IClaim };
