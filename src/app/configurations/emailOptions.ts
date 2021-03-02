const emailOptions = Object.freeze({
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT),
  emailSecure: Boolean(process.env.EMAIL_SECURE),
  user: process.env.EMAIL_AUTH_USER,
  password: process.env.EMAIL_AUTH_PASSWORD,
});

export default emailOptions;
