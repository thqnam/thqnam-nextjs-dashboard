import nodemailer from 'nodemailer';

export async function sendVerificationEmail(email: string, name: string, token: string) {
  const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.GMAIL_USER,
            pass: process.env.GMAIL_APP_PASSWORD,
        },
    });
  const verifyUrl = `https://qned.vercel.app/${token}/verifyemail`;
  await transporter.sendMail({
    from: `"${process.env.APP_NAME} Admin" <${process.env.GMAIL_USER}>`,
    to: email,
    subject: `Verify email of your ${process.env.APP_NAME} account`,
    html: `
      <p>Hi ${name},</p>
      <p>Please press to <a href="${verifyUrl}">this</a> for verify your email.</p>
      <p>If you do not have an account in ${process.env.APP_NAME} App, please ignore this email.</p>
    `,
  });
  transporter.close();
}

export async function sendResetPasswordEmail(email: string, name: string, token: string) {
  const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.GMAIL_USER,
            pass: process.env.GMAIL_APP_PASSWORD,
        },
    });
  const resetUrl = `https://qned.vercel.app/${token}/resetpassword`;
  await transporter.sendMail({
    from: `"${process.env.APP_NAME} Admin" <${process.env.GMAIL_USER}>`,
    to: email,
    subject: `Reset password of your ${process.env.APP_NAME} account`,
    html: `
      <p>Hi ${name},</p>
      <p>Please press to <a href="${resetUrl}">this</a> for reset your password.</p>
      <p>If you do not have an account in ${process.env.APP_NAME} App, please ignore this email.</p>
    `,
  });
  transporter.close();
}