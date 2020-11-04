class AppError {
  public readonly msg: string;

  public readonly statusCode: number;

  constructor(msg: string, statusCode = 400) {
    this.msg = msg;
    this.statusCode = statusCode;
  }
}

export default AppError;
