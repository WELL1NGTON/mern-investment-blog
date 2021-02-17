class AuthData {
  email: string;
  role: string;

  public toJSON() {
    return {
      email: this.email,
      role: this.role,
    };
  }
}

export default AuthData;
