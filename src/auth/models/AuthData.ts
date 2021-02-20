class AuthData {
  email: string;
  role: string;

  public toJSON(): unknown {
    return {
      email: this.email,
      role: this.role,
    };
  }
}

export default AuthData;
