const nodemailer = require('nodemailer');

// Create reusable transporter
const createTransporter = () => {
  // Check if using Ethereal or custom SMTP
  if (process.env.EMAIL_HOST && process.env.EMAIL_HOST !== 'smtp.gmail.com') {
    // Ethereal or other SMTP service
    console.log(`📧 Using email service: ${process.env.EMAIL_HOST}`);
    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: Number.parseInt(process.env.EMAIL_PORT) || 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  }
  
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
  console.log('📧 Using Gmail service');
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
    console.error('❌ Email transporter verification failed:', error.message);
    console.error('💡 Tip: Run "node setup-ethereal.js" to get test email credentials');
  } else {
    console.log('✅ Email service is ready');
    if (process.env.EMAIL_HOST === 'smtp.ethereal.email') {
      console.log('📧 Using Ethereal Email (test mode)');
      console.log('   Emails won\'t be delivered but can be viewed at: https://ethereal.email');
    }
  }
});

module.exports = transporter;
