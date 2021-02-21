class AuthData {
  email: string;
  role: string;

  public toJSON(): {
    email: string;
    role: string;
  } {
    return {
      email: this.email,
      role: this.role,
    };
  }
}

export default AuthData;
