import sendgridMail from '@sendgrid/mail';
import { config } from 'dotenv';

config();
/**
 * Send email when passed with the receiver email
 * html as the html content to be sent as the mail content
 * @param {String} userEmail The reciver's email
 * @param {String} emailSubject The subject of the email
 * @param {String} html The email's content in html format
 * @returns {boolean} return value is a promise
 * returns true if email is successfully sent else it returns false
 */
const sendMail = (userEmail, emailSubject, html) => {
  sendgridMail.setApiKey(process.env.SENDGRID_API_KEY);
  const message = {
    to: userEmail,
    from: 'no-reply@authorshaven.com',
    subject: emailSubject,
    text: 'Authorshaven',
    html: `<div>${html}</div>`,
  };
  return sendgridMail.send(message)
    .then(() => {
      const mailSent = true;
      return mailSent;
    })
    .catch(() => {
      const mailNotSent = false;
      return mailNotSent;
    });
};

export default sendMail;
