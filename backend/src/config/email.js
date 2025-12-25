const nodemailer = require('nodemailer');

// Create reusable transporter
const createTransporter = () => {
  // For development, you can use Gmail or Ethereal (test email service)
  // For production, use SendGrid, AWS SES, or other professional email service
  
  if (process.env.NODE_ENV === 'production') {
    // Production configuration (SendGrid example)
    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST || 'smtp.sendgrid.net',
      port: Number.parseInt(process.env.EMAIL_PORT) || 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  }

  // Development configuration (Gmail example)
  // Note: For Gmail, you need to enable "Less secure app access" or use App Password
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
};

const transporter = createTransporter();

// Verify transporter configuration
transporter.verify((error, success) => {
  if (error) {
    console.error('Email transporter verification failed:', error);
  } else {
    console.log('✅ Email service is ready');
  }
});

module.exports = transporter;
