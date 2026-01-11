const nodemailer = require('nodemailer');

// Create Ethereal test account and transporter
const setupEtherealEmail = async () => {
  console.log('Creating Ethereal email test account...');
  
  // Generate test SMTP service account from ethereal.email
  const testAccount = await nodemailer.createTestAccount();

  console.log('\n✅ Ethereal Email Account Created!');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('Copy these credentials to your .env file:\n');
  console.log('NODE_ENV=development');
  console.log(`EMAIL_USER=${testAccount.user}`);
  console.log(`EMAIL_PASS=${testAccount.pass}`);
  console.log('EMAIL_HOST=smtp.ethereal.email');
  console.log('EMAIL_PORT=587');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  // Create transporter
  const transporter = nodemailer.createTransport({
    host: testAccount.smtp.host,
    port: testAccount.smtp.port,
    secure: testAccount.smtp.secure,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass,
    },
  });

  // Send test email
  console.log('Sending test email...');
  const info = await transporter.sendMail({
    from: '"Vasukriti Jewels" <noreply@vasukritijewels.com>',
    to: 'customer@example.com',
    subject: 'Email Verification - Vasukriti',
    html: `
      <h2>Test Email Verification</h2>
      <p>This is a test verification email.</p>
      <a href="http://localhost:3000/verify-email?token=test123">Verify Email</a>
    `,
  });

  console.log('✅ Test email sent!');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('📧 View email at:');
  console.log(nodemailer.getTestMessageUrl(info));
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  console.log('Note: Ethereal is for testing only. Emails are not actually delivered.');
  console.log('You can view all test emails in the browser link above.\n');
};

setupEtherealEmail().catch(console.error);
