# Email Notifications System - Implementation Guide

## Overview
The email notifications system has been fully integrated into Vasukriti Jewels. Customers now receive professional HTML emails for order confirmations, shipping updates, password resets, and welcome messages.

## Architecture

### Components
1. **Email Configuration** (`/backend/src/config/email.js`)
   - Nodemailer transporter setup
   - Environment-based configuration (dev/prod)
   - Connection verification on startup

2. **Email Templates** (`/backend/src/utils/emailTemplates.js`)
   - HTML templates with inline CSS
   - Responsive design for all email clients
   - Vasukriti Jewels branding (amber-600 & rose-600 gradients)

3. **Email Service** (`/backend/src/utils/emailService.js`)
   - Utility functions for sending emails
   - Error handling and logging
   - Non-blocking email operations

4. **Controller Integration**
   - Order confirmation: `orderController.js` - `createOrder()`
   - Shipping updates: `orderController.js` - `updateOrderStatus()`
   - Welcome email: `authController.js` - `register()`
   - Password reset: `authController.js` - `forgotPassword()`

## Email Templates

### 1. Order Confirmation
**Trigger:** After successful order creation
**Recipient:** Customer email
**Content:**
- Order number and thank you message
- Complete order summary with product images
- Itemized pricing (subtotal, shipping, tax, discount)
- Shipping address
- "Track Your Order" CTA button

### 2. Shipping Update
**Trigger:** When order status changes to "shipped" or "delivered"
**Recipient:** Customer email
**Content:**
- Order number
- Tracking information (carrier, tracking number)
- Estimated delivery date
- "Track Your Order" CTA button

### 3. Password Reset
**Trigger:** When user requests password reset
**Recipient:** User email
**Content:**
- Personalized greeting
- "Reset Password" CTA button with token
- Security notice and expiration warning (1 hour)
- Ignore instructions if not requested

### 4. Welcome Email
**Trigger:** On successful user registration
**Recipient:** New user email
**Content:**
- Personalized welcome message
- Customer benefits list (first order discount, free shipping, rewards)
- First order discount code: FIRST10 (10% off)
- "Start Shopping" and "View My Account" CTA buttons

## Environment Configuration

### Development (Gmail)
Add to `/backend/.env`:
```bash
NODE_ENV=development
EMAIL_USER=your-gmail@gmail.com
EMAIL_PASS=your-gmail-app-password
FRONTEND_URL=http://localhost:3000
```

**Gmail App Password Setup:**
1. Enable 2-Factor Authentication on your Google Account
2. Go to https://myaccount.google.com/apppasswords (direct link)
   - Or: Google Account > Security > How you sign in to Google > 2-Step Verification > App passwords
3. Sign in if prompted
4. In the "App passwords" page:
   - Select app: Choose "Mail" or "Other (Custom name)"
   - If "Other", enter "Vasukriti Jewels Backend"
   - Select device: Choose your device or "Other"
5. Click "Generate"
6. Copy the 16-character password (shown without spaces)
7. Use this password as EMAIL_PASS in your .env file

**Note:** If you don't see "App passwords" option, ensure 2FA is enabled first.

### Production (SendGrid)
Add to `/backend/.env`:
```bash
NODE_ENV=production
EMAIL_HOST=smtp.sendgrid.net
EMAIL_PORT=587
EMAIL_USER=apikey
EMAIL_PASS=your-sendgrid-api-key
FRONTEND_URL=https://vasukritijewels.com
```

**SendGrid Setup:**
1. Sign up at https://sendgrid.com
2. Verify your sender email/domain
3. Create an API key under Settings > API Keys
4. Use "apikey" as EMAIL_USER (literal string)
5. Use your API key as EMAIL_PASS

## Testing

### Test Order Confirmation Email
```javascript
// Create a test order via API or admin panel
POST /api/orders
{
  "items": [
    {
      "product": "product-id",
      "quantity": 1
    }
  ],
  "shippingAddress": {
    "fullName": "Test User",
    "address": "123 Test St",
    "city": "Mumbai",
    "state": "Maharashtra",
    "postalCode": "400001",
    "phone": "1234567890"
  },
  "paymentMethod": "card"
}

// Check server logs for:
✅ Order confirmation email sent to user@example.com: <message-id>
```

### Test Shipping Update Email
```javascript
// Update order status to "shipped"
PATCH /api/orders/:orderId/status
{
  "status": "shipped",
  "note": "Order dispatched"
}

// Check server logs for:
✅ Shipping update email sent to user@example.com: <message-id>
```

### Test Welcome Email
```javascript
// Register a new user
POST /api/auth/register
{
  "fullName": "Test User",
  "email": "newuser@example.com",
  "password": "password123",
  "phone": "1234567890"
}

// Check server logs for:
✅ Welcome email sent to newuser@example.com: <message-id>
```

### Test Password Reset Email
```javascript
// Request password reset
POST /api/auth/forgot-password
{
  "email": "user@example.com"
}

// Check server logs for:
✅ Password reset email sent to user@example.com: <message-id>
```

## Error Handling

### Non-Blocking Email Operations
All email operations are wrapped in try/catch blocks to prevent failures from breaking core functionality:

- **Order Creation:** Email failure won't prevent order from being created
- **Status Updates:** Email failure won't prevent status change
- **Registration:** Email failure won't prevent account creation
- **Password Reset:** Email failure returns error (user needs to know)

### Logging
All email operations log to console:
- ✅ Success: `Email sent to user@example.com: <message-id>`
- ❌ Error: `Error sending email:` with full error details

### Email Transporter Verification
On server startup, the email configuration is verified:
```
✅ Email service is ready
```
Or error message if configuration is invalid.

## Troubleshooting

### Gmail Issues
**Problem:** "Invalid login" or "Username and Password not accepted"
**Solution:** 
- Enable 2FA on your Google Account
- Generate an App Password (not your regular password)
- Use the 16-character App Password

**Problem:** "Less secure app access"
**Solution:** 
- App Passwords bypass this restriction
- Never use regular password with "less secure apps"

### SendGrid Issues
**Problem:** "Authentication failed"
**Solution:**
- Verify EMAIL_USER is exactly "apikey" (not your email)
- Verify EMAIL_PASS is your SendGrid API key
- Check API key has "Mail Send" permissions

**Problem:** "Sender address not verified"
**Solution:**
- Verify your sender email in SendGrid dashboard
- For production, verify your domain (recommended)

### Email Not Received
**Check:**
1. Server logs for "✅ Email sent" message
2. Spam/Junk folder
3. Email address is correct
4. Environment variables are set
5. Firewall/network allows SMTP traffic (port 587)

### Frontend URL Issues
**Problem:** CTA buttons lead to wrong URL
**Solution:**
- Set FRONTEND_URL in .env
- Development: `http://localhost:3000`
- Production: `https://yourdomain.com`

## Features

### Responsive Design
- Mobile-optimized layout
- Inline CSS for maximum compatibility
- Works across all major email clients (Gmail, Outlook, Apple Mail, etc.)

### Branding
- Vasukriti Jewels color scheme (amber-600 & rose-600 gradients)
- Professional header with logo/name
- Consistent footer with contact info and copyright

### Security
- Password reset links expire in 1 hour
- Reset tokens are hashed before storage
- Security notices in password reset emails
- Sensitive operations logged

### User Experience
- Clear, scannable content
- Prominent CTA buttons
- Order/tracking information highlighted
- Helpful contact information in footer

## Future Enhancements

### Potential Additions
1. **Order Delivery Confirmation**
   - Trigger when status changes to "delivered"
   - Request for review/feedback

2. **Abandoned Cart Recovery**
   - Send reminder after 24 hours
   - Include cart items and "Complete Purchase" link

3. **Promotional Emails**
   - New product launches
   - Seasonal sales
   - Exclusive offers for loyal customers

4. **Review Request**
   - 7 days after delivery
   - Link to product review page

5. **Email Preferences**
   - User settings to opt-in/out of different email types
   - Unsubscribe link in marketing emails

### Template Customization
All templates support dynamic content:
- Personalized greetings (user name)
- Order-specific details
- Dynamic CTAs based on order status
- Environment-aware URLs

## Code Structure

### Email Template Pattern
```javascript
const templateName = (data) => {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Email Title</title>
</head>
<body style="inline-css">
  <!-- Email content -->
</body>
</html>
  `;
};
```

### Email Service Pattern
```javascript
const sendEmailType = async (recipient, data) => {
  try {
    const mailOptions = {
      from: `"Vasukriti Jewels" <${process.env.EMAIL_USER}>`,
      to: recipient.email,
      subject: 'Email Subject',
      html: emailTemplate(data),
    };
    
    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ Email sent to ${recipient.email}: ${info.messageId}`);
    return info;
  } catch (error) {
    console.error('❌ Error sending email:', error);
    // Handle appropriately
  }
};
```

## Integration Checklist

- [x] Email configuration created
- [x] Email templates created (4 templates)
- [x] Email service utilities created
- [x] Order confirmation integration
- [x] Shipping update integration
- [x] Welcome email integration
- [x] Password reset integration
- [x] Environment variables documented
- [x] Error handling implemented
- [x] Logging implemented
- [ ] Environment variables configured (user action required)
- [ ] Email service tested
- [ ] Production email provider setup (SendGrid recommended)

## Next Steps

1. **Configure Environment Variables**
   - Copy `.env.example` to `.env`
   - Add Gmail credentials (development)
   - Plan SendGrid setup (production)

2. **Test Email System**
   - Register a test user (welcome email)
   - Create a test order (confirmation email)
   - Update order status (shipping email)
   - Request password reset (reset email)

3. **Production Setup**
   - Sign up for SendGrid
   - Verify sender domain
   - Generate API key
   - Update production .env file
   - Test in staging environment

4. **Monitor**
   - Check server logs for email errors
   - Monitor email delivery rates
   - Watch for bounces/spam reports
   - Track user engagement with emails

---

**Email System Status:** ✅ Fully Implemented
**Configuration Required:** Yes (environment variables)
**Ready for Testing:** Yes
**Production Ready:** After SendGrid setup
