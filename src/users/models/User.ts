import Role, { defaultRole } from "@shared/types/Role";

import Email from "@shared/richObjects/Email";
import Entity from "@shared/models/Entity";
import Password from "@shared/richObjects/Password";

/**
 * @typedef User
 */
class User extends Entity {
  private _password!: Password;
  email!: Email;
  role!: Role;
  isActive!: boolean;

  constructor(
    email: string,
    password: string,
    role: Role = defaultRole,
    isActive: boolean = true
  ) {
    super();
    this.email = new Email(email);
    this._password = new Password(password);
    this.role = role;
    this.isActive = isActive;
  }

  public set password(password: string) {
    this._password.value = password;
  }

  public get password() {
    return this._password.value;
  }

  public toString() {
    return `${this.role} | ${this.email}`;
  }

  public async encryptPassword() {
    this._password.value = await Password.encrypt(this._password.value);
  }

  public clearPassword() {
    this._password.clearPassword();
  }

  public toJSON() {
    // Don't return password on json files
    return {
      id: this.id,
      email: this.email.value,
      role: this.role,
      isActive: this.isActive,
    };
  }
}

export default User;
