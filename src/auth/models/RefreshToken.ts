import Email from "@shared/valueObjects/Email";
import Entity from "@shared/models/Entity";

class RefreshToken extends Entity {
  constructor(email: string, token: string, expirationDate: Date) {
    super();

    this.email = new Email(email);
    this.token = token;
    this.expirationDate = expirationDate;
  }

  email: Email;
  token: string;
  expirationDate: Date;

  public toJSON(): unknown {
    return {
      id: this.id,
      email: this.email,
      token: this.token,
      expirationDate: this.expirationDate,
    };
  }
}

export default RefreshToken;
