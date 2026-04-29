const nodemailer = require('nodemailer');

let cachedTransporter = null;

const hasSmtpConfig = () =>
  Boolean(process.env.SMTP_HOST && process.env.SMTP_PORT && process.env.SMTP_USER && process.env.SMTP_PASS);

const getTransporter = () => {
  if (!hasSmtpConfig()) {
    return null;
  }

  if (!cachedTransporter) {
    cachedTransporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: Number(process.env.SMTP_PORT) === 465,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
      connectionTimeout: 10000,
      greetingTimeout: 10000,
      socketTimeout: 20000,
    });
  }

  return cachedTransporter;
};

const sendEmail = async (to, subject, html) => {
  const transporter = getTransporter();

  if (!transporter) {
    console.warn('SMTP is not configured. Skipping email delivery.');
    return false;
  }

  try {
    await transporter.sendMail({
      from: `"JCI Madurai Central" <${process.env.SMTP_USER}>`,
      to,
      subject,
      html,
    });
    return true;
  } catch (error) {
    console.error('Email send error:', error);
    return false;
  }
};

module.exports = { hasSmtpConfig, sendEmail };
