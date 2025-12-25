const transporter = require('../config/email');
const {
  orderConfirmationTemplate,
  shippingUpdateTemplate,
  passwordResetTemplate,
  welcomeEmailTemplate,
} = require('./emailTemplates');

/**
 * Send order confirmation email
 * @param {Object} order - Order document with populated items
 * @param {Object} user - User document
 */
const sendOrderConfirmation = async (order, user) => {
  try {
    const mailOptions = {
      from: `"Vasukriti Jewels" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: `Order Confirmation - #${order.orderNumber}`,
      html: orderConfirmationTemplate(order),
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ Order confirmation email sent to ${user.email}: ${info.messageId}`);
    return info;
  } catch (error) {
    console.error('❌ Error sending order confirmation email:', error);
    // Don't throw error - email failure shouldn't break order flow
  }
};

/**
 * Send shipping update email
 * @param {Object} order - Order document
 * @param {Object} user - User document
 * @param {Object} trackingInfo - Tracking information {carrier, trackingNumber}
 */
const sendShippingUpdate = async (order, user, trackingInfo = null) => {
  try {
    const mailOptions = {
      from: `"Vasukriti Jewels" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: `Your Order Has Been Shipped - #${order.orderNumber}`,
      html: shippingUpdateTemplate(order, trackingInfo),
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ Shipping update email sent to ${user.email}: ${info.messageId}`);
    return info;
  } catch (error) {
    console.error('❌ Error sending shipping update email:', error);
    // Don't throw error - email failure shouldn't break order flow
  }
};

/**
 * Send password reset email
 * @param {Object} user - User document
 * @param {String} resetToken - Password reset token
 * @param {String} resetUrl - Password reset URL
 */
const sendPasswordReset = async (user, resetToken, resetUrl) => {
  try {
    const mailOptions = {
      from: `"Vasukriti Jewels" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: 'Password Reset Request - Vasukriti Jewels',
      html: passwordResetTemplate(resetUrl, user.name),
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ Password reset email sent to ${user.email}: ${info.messageId}`);
    return info;
  } catch (error) {
    console.error('❌ Error sending password reset email:', error);
    throw error; // Throw error for password reset - user needs to know if it failed
  }
};

/**
 * Send welcome email to new users
 * @param {Object} user - User document
 */
const sendWelcomeEmail = async (user) => {
  try {
    const mailOptions = {
      from: `"Vasukriti Jewels" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: 'Welcome to Vasukriti Jewels! ',
      html: welcomeEmailTemplate(user.name),
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ Welcome email sent to ${user.email}: ${info.messageId}`);
    return info;
  } catch (error) {
    console.error('❌ Error sending welcome email:', error);
    // Don't throw error - email failure shouldn't break registration flow
  }
};

module.exports = {
  sendOrderConfirmation,
  sendShippingUpdate,
  sendPasswordReset,
  sendWelcomeEmail,
};
