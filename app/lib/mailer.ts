import nodemailer from 'nodemailer';

function startMailer(){
  const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.GMAIL_USER,
            pass: process.env.GMAIL_APP_PASSWORD,
        },
    }
  );
  return transporter;
}

export async function sendVerificationEmail(email: string, name: string, token: string) {
  const transporter = startMailer();
  const verifyUrl = `https://qned.vercel.app/${token}/signupcomplete`;
  await transporter.sendMail({
    from: `"${process.env.APP_NAME} App's Owner" <${process.env.GMAIL_USER}>`,
    to: email,
    subject: `Complete your ${process.env.APP_NAME} App Sign Up Request`,
    html: `
      <p>Hi ${name},</p>
      <p>I'm <a href="${process.env.OWNER_INFOR}">${process.env.APP_OWNER}</a>.</p>
      <p>Owner of <a href="${process.env.APP_HOMEPAGE}">${process.env.APP_NAME}</a> App.</p>
      <p>If you sign up an new account in my <a href="${process.env.APP_HOMEPAGE}">${process.env.APP_NAME}</a> App<p>
      <p>Please press to <a href="${verifyUrl}">This</a> for verify your ${process.env.APP_NAME} App account email.</p>
      <p>If you do not have an account in <a href="${process.env.APP_HOMEPAGE}">${process.env.APP_NAME}</a> App,</p>
      <p>Please ignore this email, sorry for bothering you<p>
    `,
  });
  transporter.close();
}

export async function sendResetPasswordEmail(email: string, name: string, token: string) {
  const transporter = startMailer();
  const resetUrl = `https://qned.vercel.app/${token}/resetpassword`;
  await transporter.sendMail({
    from: `"${process.env.APP_NAME} App's Owner" <${process.env.GMAIL_USER}>`,
    to: email,
    subject: `Verify request forgot password of your ${process.env.APP_NAME} account`,
    html: `
      <p>Hi ${name},</p>
      <p>I'm <a href="${process.env.OWNER_INFOR}">${process.env.APP_OWNER}</a>.</p>
      <p>Owner of <a href="${process.env.APP_HOMEPAGE}">${process.env.APP_NAME}</a> App.</p>
      <p>Please press to <a href="${resetUrl}">this</a> for reset your ${process.env.APP_NAME} App account password.</p>
      <p>If you do not have an account in <a href="${process.env.APP_HOMEPAGE}">${process.env.APP_NAME}</a> App,</p>
      <p>Please ignore this email, sorry for bothering you<p>
    `,
  });
  transporter.close();
}

export async function sendSignDownEmail(email: string, name: string, token: string) {
  const transporter = startMailer();
  const signDownUrl = `https://qned.vercel.app/dashboard/${token}/signdowncomplete`;
  await transporter.sendMail({
    from: `"${process.env.APP_NAME} App's Owner" <${process.env.GMAIL_USER}>`,
    to: email,
    subject: `Verify request sign down of your ${process.env.APP_NAME} account`,
    html: `
      <p>Hi ${name},</p>
      <p>I'm <a href="${process.env.OWNER_INFOR}">${process.env.APP_OWNER}</a>.</p>
      <p>Owner of <a href="${process.env.APP_HOMEPAGE}">${process.env.APP_NAME}</a> App.</p>
      <p>Please press to <a href="${signDownUrl}">this</a> for sign down your ${process.env.APP_NAME} App account password.</p>
      <p>If you do not have an account in <a href="${process.env.APP_HOMEPAGE}">${process.env.APP_NAME}</a> App,</p>
      <p>Please ignore this email, sorry for bothering you<p>
    `,
  });
  transporter.close();
}