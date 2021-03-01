import EmailValidator from "email-validator";

class EmailError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "EmailError";
  }
}

class Email {
  private _value: string;

  constructor(email = "example@example.com") {
    this._value = email;
  }

  public set value(email: string) {
    if (!Email.isValid(email)) throw new EmailError("Invalid email!");

    this._value = email;
  }

  public get value(): string {
    return this._value;
  }

  public toString(): string {
    return this.value;
  }

  public toJson(): string {
    return this.toString();
  }

  static isValid(email: string): boolean {
    return EmailValidator.validate(email);
  }

  static EmailError = EmailError;
}

export default Email;
