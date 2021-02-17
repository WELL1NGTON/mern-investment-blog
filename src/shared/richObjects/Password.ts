import bcrypt from "bcrypt";

class PasswordError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "PasswordError";
  }
}

class Password {
  constructor(password: string) {
    this.value = password;
  }

  private _value: string;

  public set value(password: string) {
    if (!Password.isValid(password))
      throw new PasswordError("Invalid Password");

    this._value = password;
  }

  public get value() {
    return this._value;
  }

  public static isValid(unencryptedPassword: string) {
    // TODO: criar uma validação decente de senha
    return unencryptedPassword.length >= 6;
  }

  public static async encrypt(unencryptedPassword: string) {
    try {
      const salt = await bcrypt.genSalt(10);
      return bcrypt.hash(unencryptedPassword, salt);
    } catch {
      throw new PasswordError("Erro ao encriptar a senha");
    }
  }

  public static async isMatch(
    unencryptedPassword: string,
    hashedPassword: string
  ) {
    return await bcrypt.compare(unencryptedPassword, hashedPassword);
  }

  public clearPassword() {
    this._value = "";
  }
}

export default Password;
