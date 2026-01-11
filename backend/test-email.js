require('dotenv').config();
const nodemailer = require('nodemailer');

const testEmail = async () => {
  console.log('Testing email configuration...');
  console.log('EMAIL_USER:', process.env.EMAIL_USER);
  console.log('EMAIL_PASS:', process.env.EMAIL_PASS ? '***' + process.env.EMAIL_PASS.slice(-4) : 'NOT SET');
  console.log('EMAIL_HOST:', process.env.EMAIL_HOST || 'gmail (default)');
  console.log('EMAIL_PORT:', process.env.EMAIL_PORT || '587 (default)');

  let transporter;
  
  if (process.env.EMAIL_HOST && process.env.EMAIL_HOST !== 'smtp.gmail.com') {
    // Use custom SMTP (Ethereal or other)
    transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: Number.parseInt(process.env.EMAIL_PORT) || 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  } else {
    // Use Gmail
    transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  }

  try {
    // Verify connection
    await transporter.verify();
    console.log('✅ Email transporter verified successfully');

    // Send test email
    const info = await transporter.sendMail({
      from: `"Vasukriti Test" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER, // Send to yourself
      subject: 'Test Email - Vasukriti',
      html: `
        <h1>Email Configuration Test</h1>
        <p>If you're seeing this, your email configuration is working correctly!</p>
        <p>Time: ${new Date().toLocaleString()}</p>
      `,
    });

    console.log('✅ Test email sent successfully!');
    console.log('Message ID:', info.messageId);
    
    if (process.env.EMAIL_HOST === 'smtp.ethereal.email') {
      const previewUrl = nodemailer.getTestMessageUrl(info);
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('📧 View test email at:');
      console.log(previewUrl);
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    } else {
      console.log('Check your inbox at:', process.env.EMAIL_USER);
    }
  } catch (error) {
    console.error('❌ Email test failed:', error.message);
    console.error('\nPossible solutions:');
    console.error('1. Generate a Gmail App Password:');
    console.error('   - Go to: https://myaccount.google.com/apppasswords');
    console.error('   - Create app password for "Mail"');
    console.error('   - Update EMAIL_PASS in .env with the 16-character password');
    console.error('\n2. Enable 2-Step Verification first (required for App Passwords)');
    console.error('   - Go to: https://myaccount.google.com/security');
    console.error('\n3. Alternative: Use Ethereal Email (test email service)');
    console.error('   - Run: node setup-ethereal.js');
    console.error('   - Copy the credentials to .env');
  }
};

testEmail();
