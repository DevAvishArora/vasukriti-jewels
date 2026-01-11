const orderConfirmationTemplate = (order) => {
  const itemsHtml = order.items
    .map(
      (item) => `
    <tr>
      <td style="padding: 12px; border-bottom: 1px solid #eee;">
        <div style="display: flex; align-items: center; gap: 12px;">
          <img src="${item.product.image}" alt="${item.product.name}" style="width: 60px; height: 60px; object-fit: cover; border-radius: 4px;">
          <div>
            <div style="font-weight: 600; color: #1f2937;">${item.product.name}</div>
            <div style="font-size: 14px; color: #6b7280;">Quantity: ${item.quantity}</div>
          </div>
        </div>
      </td>
      <td style="padding: 12px; text-align: right; border-bottom: 1px solid #eee; font-weight: 600;">
        ₹${item.price.toLocaleString()}
      </td>
    </tr>
  `
    )
    .join('');

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Order Confirmation</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f3f4f6;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f3f4f6; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #d97706 0%, #e11d48 100%); padding: 40px 30px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700;">Vasukriti</h1>
              <p style="margin: 8px 0 0 0; color: #fef3c7; font-size: 16px;">Order Confirmation</p>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding: 40px 30px;">
              <h2 style="margin: 0 0 16px 0; color: #1f2937; font-size: 24px;">Thank you for your order!</h2>
              <p style="margin: 0 0 24px 0; color: #6b7280; font-size: 16px; line-height: 1.6;">
                We've received your order and will send you a confirmation once it has been shipped. Your order details are below.
              </p>

              <!-- Order Info -->
              <div style="background-color: #fef3c7; border-left: 4px solid #d97706; padding: 16px; margin-bottom: 24px; border-radius: 4px;">
                <p style="margin: 0 0 8px 0; color: #92400e; font-size: 14px; font-weight: 600;">Order Number</p>
                <p style="margin: 0; color: #92400e; font-size: 20px; font-weight: 700;">#${order.orderNumber}</p>
              </div>

              <!-- Items -->
              <h3 style="margin: 0 0 16px 0; color: #1f2937; font-size: 18px;">Order Items</h3>
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 24px; border: 1px solid #e5e7eb; border-radius: 4px;">
                ${itemsHtml}
              </table>

              <!-- Summary -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 24px;">
                <tr>
                  <td style="padding: 8px 0; color: #6b7280;">Subtotal</td>
                  <td style="padding: 8px 0; text-align: right; color: #1f2937;">₹${(order.subtotal || 0).toLocaleString()}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #6b7280;">Shipping</td>
                  <td style="padding: 8px 0; text-align: right; color: #1f2937;">₹${(order.shippingCharge || 0).toLocaleString()}</td>
                </tr>
                ${
                  order.discount && order.discount > 0
                    ? `
                <tr>
                  <td style="padding: 8px 0; color: #059669;">Discount</td>
                  <td style="padding: 8px 0; text-align: right; color: #059669;">-₹${order.discount.toLocaleString()}</td>
                </tr>
                `
                    : ''
                }
                <tr style="border-top: 2px solid #e5e7eb;">
                  <td style="padding: 16px 0 0 0; color: #1f2937; font-size: 18px; font-weight: 700;">Total</td>
                  <td style="padding: 16px 0 0 0; text-align: right; color: #d97706; font-size: 20px; font-weight: 700;">₹${(order.totalAmount || 0).toLocaleString()}</td>
                </tr>
              </table>

              <!-- Shipping Address -->
              <h3 style="margin: 0 0 16px 0; color: #1f2937; font-size: 18px;">Shipping Address</h3>
              <div style="background-color: #f9fafb; padding: 16px; border-radius: 4px; margin-bottom: 24px;">
                <p style="margin: 0 0 4px 0; color: #1f2937; font-weight: 600;">${order.shippingAddress.fullName}</p>
                <p style="margin: 0 0 4px 0; color: #6b7280;">${order.shippingAddress.address}</p>
                <p style="margin: 0 0 4px 0; color: #6b7280;">${order.shippingAddress.city}, ${order.shippingAddress.state} ${order.shippingAddress.postalCode}</p>
                <p style="margin: 0; color: #6b7280;">Phone: ${order.shippingAddress.phone}</p>
              </div>

              <!-- CTA Button -->
              <div style="text-align: center; margin-top: 32px;">
                <a href="${process.env.FRONTEND_URL}/account/orders/${order._id}" style="display: inline-block; background: linear-gradient(135deg, #d97706 0%, #e11d48 100%); color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 6px; font-weight: 600; font-size: 16px;">
                  Track Your Order
                </a>
              </div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f9fafb; padding: 30px; text-align: center; border-top: 1px solid #e5e7eb;">
              <p style="margin: 0 0 8px 0; color: #6b7280; font-size: 14px;">
                Questions? Contact us at <a href="mailto:support@vasukritijewels.com" style="color: #d97706; text-decoration: none;">support@vasukritijewels.com</a>
              </p>
              <p style="margin: 0; color: #9ca3af; font-size: 12px;">
                © ${new Date().getFullYear()} Vasukriti. All rights reserved.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
};

const shippingUpdateTemplate = (order, trackingInfo) => {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Shipping Update</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f3f4f6;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f3f4f6; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #059669 0%, #0891b2 100%); padding: 40px 30px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700;">Vasukriti</h1>
              <p style="margin: 8px 0 0 0; color: #d1fae5; font-size: 16px;">Your Order is on the Way!</p>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding: 40px 30px;">
              <h2 style="margin: 0 0 16px 0; color: #1f2937; font-size: 24px;">Order Shipped!</h2>
              <p style="margin: 0 0 24px 0; color: #6b7280; font-size: 16px; line-height: 1.6;">
                Great news! Your order has been shipped and is on its way to you.
              </p>

              <!-- Order Info -->
              <div style="background-color: #d1fae5; border-left: 4px solid #059669; padding: 16px; margin-bottom: 24px; border-radius: 4px;">
                <p style="margin: 0 0 8px 0; color: #065f46; font-size: 14px; font-weight: 600;">Order Number</p>
                <p style="margin: 0; color: #065f46; font-size: 20px; font-weight: 700;">#${order.orderNumber}</p>
              </div>

              <!-- Tracking Info -->
              ${
                trackingInfo
                  ? `
              <div style="background-color: #f0fdfa; padding: 20px; border-radius: 8px; margin-bottom: 24px; border: 1px solid #99f6e4;">
                <h3 style="margin: 0 0 12px 0; color: #1f2937; font-size: 16px;">Tracking Information</h3>
                <p style="margin: 0 0 8px 0; color: #6b7280;">Carrier: <strong style="color: #1f2937;">${trackingInfo.carrier}</strong></p>
                <p style="margin: 0; color: #6b7280;">Tracking Number: <strong style="color: #1f2937;">${trackingInfo.trackingNumber}</strong></p>
              </div>
              `
                  : ''
              }

              <!-- Estimated Delivery -->
              <div style="text-align: center; background-color: #fef3c7; padding: 20px; border-radius: 8px; margin-bottom: 24px;">
                <p style="margin: 0 0 8px 0; color: #92400e; font-size: 14px; font-weight: 600;">Estimated Delivery</p>
                <p style="margin: 0; color: #92400e; font-size: 24px; font-weight: 700;">${order.estimatedDelivery || '3-5 Business Days'}</p>
              </div>

              <!-- CTA Button -->
              <div style="text-align: center; margin-top: 32px;">
                <a href="${process.env.FRONTEND_URL}/account/orders/${order._id}" style="display: inline-block; background: linear-gradient(135deg, #059669 0%, #0891b2 100%); color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 6px; font-weight: 600; font-size: 16px;">
                  Track Your Order
                </a>
              </div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f9fafb; padding: 30px; text-align: center; border-top: 1px solid #e5e7eb;">
              <p style="margin: 0 0 8px 0; color: #6b7280; font-size: 14px;">
                Questions? Contact us at <a href="mailto:support@vasukritijewels.com" style="color: #059669; text-decoration: none;">support@vasukritijewels.com</a>
              </p>
              <p style="margin: 0; color: #9ca3af; font-size: 12px;">
                © ${new Date().getFullYear()} Vasukriti. All rights reserved.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
};

const passwordResetTemplate = (resetUrl, userName) => {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Password Reset</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f3f4f6;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f3f4f6; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #7c3aed 0%, #db2777 100%); padding: 40px 30px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700;">Vasukriti</h1>
              <p style="margin: 8px 0 0 0; color: #f3e8ff; font-size: 16px;">Password Reset Request</p>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding: 40px 30px;">
              <h2 style="margin: 0 0 16px 0; color: #1f2937; font-size: 24px;">Reset Your Password</h2>
              <p style="margin: 0 0 24px 0; color: #6b7280; font-size: 16px; line-height: 1.6;">
                Hi ${userName},
              </p>
              <p style="margin: 0 0 24px 0; color: #6b7280; font-size: 16px; line-height: 1.6;">
                We received a request to reset your password. Click the button below to create a new password. This link will expire in 1 hour.
              </p>

              <!-- CTA Button -->
              <div style="text-align: center; margin: 32px 0;">
                <a href="${resetUrl}" style="display: inline-block; background: linear-gradient(135deg, #7c3aed 0%, #db2777 100%); color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 6px; font-weight: 600; font-size: 16px;">
                  Reset Password
                </a>
              </div>

              <p style="margin: 24px 0 0 0; color: #6b7280; font-size: 14px; line-height: 1.6;">
                If you didn't request a password reset, you can safely ignore this email. Your password will remain unchanged.
              </p>

              <!-- Security Notice -->
              <div style="background-color: #fef2f2; border-left: 4px solid #dc2626; padding: 16px; margin-top: 24px; border-radius: 4px;">
                <p style="margin: 0; color: #991b1b; font-size: 14px; line-height: 1.6;">
                  <strong>Security Tip:</strong> Never share your password reset link with anyone. Vasukriti will never ask for your password via email.
                </p>
              </div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f9fafb; padding: 30px; text-align: center; border-top: 1px solid #e5e7eb;">
              <p style="margin: 0 0 8px 0; color: #6b7280; font-size: 14px;">
                Questions? Contact us at <a href="mailto:support@vasukritijewels.com" style="color: #7c3aed; text-decoration: none;">support@vasukritijewels.com</a>
              </p>
              <p style="margin: 0; color: #9ca3af; font-size: 12px;">
                © ${new Date().getFullYear()} Vasukriti. All rights reserved.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
};

const welcomeEmailTemplate = (userName) => {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to Vasukriti</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f3f4f6;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f3f4f6; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #d97706 0%, #e11d48 100%); padding: 40px 30px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 32px; font-weight: 700;">Welcome to Vasukriti!</h1>
              <p style="margin: 12px 0 0 0; color: #fef3c7; font-size: 16px;"> Crafting Timeless Elegance </p>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding: 40px 30px;">
              <h2 style="margin: 0 0 16px 0; color: #1f2937; font-size: 24px;">Hello ${userName}!</h2>
              <p style="margin: 0 0 16px 0; color: #6b7280; font-size: 16px; line-height: 1.6;">
                Thank you for joining Vasukriti! We're thrilled to have you as part of our community.
              </p>
              <p style="margin: 0 0 24px 0; color: #6b7280; font-size: 16px; line-height: 1.6;">
                Discover our exquisite collection of handcrafted jewelry pieces that blend traditional artistry with contemporary design.
              </p>

              <!-- Benefits -->
              <div style="background-color: #fef3c7; padding: 24px; border-radius: 8px; margin-bottom: 24px;">
                <h3 style="margin: 0 0 16px 0; color: #92400e; font-size: 18px;">Your Benefits:</h3>
                <ul style="margin: 0; padding: 0 0 0 20px; color: #92400e;">
                  <li style="margin-bottom: 8px;">🎁 10% off on your first order with code: <strong>FIRST10</strong></li>
                  <li style="margin-bottom: 8px;">📦 Free shipping on orders above ₹10,000</li>
                  <li style="margin-bottom: 8px;">💎 Access to exclusive collections</li>
                  <li style="margin-bottom: 8px;">🔔 Early notifications about sales and new arrivals</li>
                  <li>⭐ Earn rewards with every purchase</li>
                </ul>
              </div>

              <!-- CTA Buttons -->
              <div style="text-align: center; margin: 32px 0;">
                <a href="${process.env.FRONTEND_URL}/shop" style="display: inline-block; background: linear-gradient(135deg, #d97706 0%, #e11d48 100%); color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 6px; font-weight: 600; font-size: 16px; margin: 0 8px 8px 8px;">
                  Start Shopping
                </a>
                <a href="${process.env.FRONTEND_URL}/account" style="display: inline-block; background-color: #ffffff; color: #d97706; text-decoration: none; padding: 14px 32px; border-radius: 6px; font-weight: 600; font-size: 16px; border: 2px solid #d97706; margin: 0 8px 8px 8px;">
                  View My Account
                </a>
              </div>

              <p style="margin: 24px 0 0 0; color: #6b7280; font-size: 14px; text-align: center; line-height: 1.6;">
                Follow us on social media for inspiration and exclusive offers!
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f9fafb; padding: 30px; text-align: center; border-top: 1px solid #e5e7eb;">
              <p style="margin: 0 0 8px 0; color: #6b7280; font-size: 14px;">
                Need help? Contact us at <a href="mailto:support@vasukritijewels.com" style="color: #d97706; text-decoration: none;">support@vasukritijewels.com</a>
              </p>
              <p style="margin: 0; color: #9ca3af; font-size: 12px;">
                © ${new Date().getFullYear()} Vasukriti. All rights reserved.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
};

const emailVerificationTemplate = (verificationUrl, userName) => {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Verify Your Email</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f3f4f6;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f3f4f6; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #d97706 0%, #e11d48 100%); padding: 40px 30px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700;">Vasukriti</h1>
              <p style="margin: 8px 0 0 0; color: #fef3c7; font-size: 16px;">Email Verification</p>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding: 40px 30px;">
              <h2 style="margin: 0 0 16px 0; color: #1f2937; font-size: 24px;">Verify Your Email Address</h2>
              <p style="margin: 0 0 24px 0; color: #6b7280; font-size: 16px; line-height: 1.6;">
                Hi ${userName},
              </p>
              <p style="margin: 0 0 24px 0; color: #6b7280; font-size: 16px; line-height: 1.6;">
                Thank you for registering with Vasukriti! To complete your registration and start shopping, please verify your email address by clicking the button below. This link will expire in 24 hours.
              </p>

              <!-- CTA Button -->
              <div style="text-align: center; margin: 32px 0;">
                <a href="${verificationUrl}" style="display: inline-block; background: linear-gradient(135deg, #d97706 0%, #e11d48 100%); color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 6px; font-weight: 600; font-size: 16px;">
                  Verify Email Address
                </a>
              </div>

              <p style="margin: 24px 0 0 0; color: #6b7280; font-size: 14px; line-height: 1.6;">
                If you didn't create an account with Vasukriti, you can safely ignore this email.
              </p>

              <!-- Info Notice -->
              <div style="background-color: #fef3c7; border-left: 4px solid #d97706; padding: 16px; margin-top: 24px; border-radius: 4px;">
                <p style="margin: 0; color: #92400e; font-size: 14px; line-height: 1.6;">
                  <strong>Note:</strong> You can browse our collection, but you'll need to verify your email before placing any orders.
                </p>
              </div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f9fafb; padding: 30px; text-align: center; border-top: 1px solid #e5e7eb;">
              <p style="margin: 0 0 8px 0; color: #6b7280; font-size: 14px;">
                Questions? Contact us at <a href="mailto:support@vasukritijewels.com" style="color: #d97706; text-decoration: none;">support@vasukritijewels.com</a>
              </p>
              <p style="margin: 0; color: #9ca3af; font-size: 12px;">
                © ${new Date().getFullYear()} Vasukriti. All rights reserved.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
};

module.exports = {
  orderConfirmationTemplate,
  shippingUpdateTemplate,
  passwordResetTemplate,
  welcomeEmailTemplate,
  emailVerificationTemplate,
};
