import { smtp } from '@config';
import * as nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: smtp.host,
  port: smtp.port,
  secure: smtp.password,
  auth: {
    user: smtp.user,
    pass: smtp.password,
  },
});

export const verifySmtpAsync = () => {
  return new Promise((resolve, reject) => {
    transporter.verify(error => {
      if (error) {
        throw new Error(error);
      } else {
        console.log('Server email is ready');
        resolve();
      }
    });
  });
};

export const sendEmail = async (to: string[], subject: string, text: string) => {
  const email: any = {
    subject,
    from: '"Doxy 📅" <noreply@t2c.dev>', // sender address
    to: to.join(', '),
  };
  if (text.includes('</') && text.includes('>')) {
    email.html = text;
  } else {
    email.text = text;
  }

  const info = await transporter.sendMail(email);

  console.log('Message sent: %s', info.messageId);
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

  // Preview only available when sending through an Ethereal account
  console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
};
