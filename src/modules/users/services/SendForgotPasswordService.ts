import User from "@shared/models/user.model";
import { generateResetPasswordToken } from "@shared/util/jwtTokens";
import AppError from "@shared/errors/AppError";
const nodemailer = require("nodemailer");

interface IRequest {
  email: string;
}

interface IResponse {
  resetLink: string;
}

class SendForgotPasswordService {
  public async execute({ email }: IRequest): Promise<IResponse> {
    const user = await User.findOne({ email }).exec();

    if (!user) {
      throw new AppError("Usuário não existe.", 400);
    }

    const resetPasswordToken = generateResetPasswordToken(email);

    if (!resetPasswordToken) {
      throw new AppError("Falha ao gerar token de recuperação.", 500);
    }

    const updatedUser = await User.findOneAndUpdate(
      { email },
      { resetPasswordToken }
    ).exec();

    if (!updatedUser) {
      throw new AppError(
        "Falha ao gerar vincular o token de recuperação ao usuário.",
        500
      );
    }

    const mailHost = process.env.MAIL_HOST;
    const mailPort = process.env.MAIL_PORT || 465;
    const mailSecure = Boolean(process.env.MAIL_SECURE);
    const mailUser = process.env.MAIL_AUTH_USER;
    const mailPassword = process.env.MAIL_AUTH_PASSWORD;

    if (!mailHost || !mailUser || !mailPassword) {
      throw new AppError(
        "Email de envio de recuperação de senhas não configurado.",
        500
      );
    }

    const resetLink = `http://localhost:3000/reset/${resetPasswordToken}`; //TODO: Precisa ser alterado

    const transporter = nodemailer.createTransport({
      host: mailHost,
      port: mailPort,
      secure: mailSecure, // true for 465, false for other ports
      auth: {
        user: mailUser, // generated ethereal user
        pass: mailPassword, // generated ethereal password
      },
    });

    const mail = await transporter.sendMail({
      from: '"InvestmentBlog " <foo@example.com>', // sender address
      to: email, // list of receivers
      subject: "Password Recovery", // Subject line
      text: `Password recovery token is ${resetLink}`, // plain text body
      html: `<b>Password recovery token is <a href="${resetLink}">${resetLink}</a></b>`, // html body
    });

    if (mail?.messageId) return { resetLink };
    else {
      throw new AppError("Falha ao enviar email de recuperação.", 500);
    }
  }
}

export default SendForgotPasswordService;
