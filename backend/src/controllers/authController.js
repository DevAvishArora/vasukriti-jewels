const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { generateToken, generateRefreshToken, generateRandomToken, hashToken } = require('../utils/tokenUtils');
const logger = require('../utils/logger');
const { sendWelcomeEmail, sendPasswordReset, sendVerificationEmail } = require('../utils/emailService');

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
const register = async (req, res, next) => {
  try {
    const { fullName, email, password, phone } = req.body;

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      res.status(400);
      throw new Error('User already exists with this email');
    }

    // Create user
    const user = await User.create({
      fullName,
      email,
      password,
      phone,
    });

    if (user) {
      // Generate verification token
      const verificationToken = generateRandomToken();
      user.verificationToken = hashToken(verificationToken);
      user.verificationTokenExpires = Date.now() + 24 * 60 * 60 * 1000; // 24 hours
      await user.save();

      // Send verification email
      const verificationUrl = `${process.env.FRONTEND_URL}/verify-email?token=${verificationToken}`;
      try {
        await sendVerificationEmail(
          { email: user.email, name: user.fullName },
          verificationToken,
          verificationUrl
        );
        logger.info(`Verification email sent to: ${user.email}`);
      } catch (emailError) {
        logger.error('Failed to send verification email:', emailError);
        // Don't fail registration if email fails, but log it
      }

      // Send welcome email
      try {
        await sendWelcomeEmail({ email: user.email, name: user.fullName });
        logger.info(`Welcome email sent to: ${user.email}`);
      } catch (emailError) {
        logger.error('Failed to send welcome email:', emailError);
        // Don't fail registration if email fails
      }

      logger.info(`New user registered: ${user.email}`);

      res.status(201).json({
        success: true,
        message: 'Registration successful. Please check your email to verify your account.',
        data: {
          user: {
            id: user._id,
            fullName: user.fullName,
            email: user.email,
            role: user.role,
            isVerified: user.isVerified,
          },
          token: generateToken(user._id),
          refreshToken: generateRefreshToken(user._id),
        },
      });
    } else {
      res.status(400);
      throw new Error('Invalid user data');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      res.status(401);
      throw new Error('Invalid email or password');
    }

    // Check if password matches
    const isPasswordMatch = await user.matchPassword(password);
    if (!isPasswordMatch) {
      res.status(401);
      throw new Error('Invalid email or password');
    }

    // Check if user is active
    if (!user.isActive) {
      res.status(403);
      throw new Error('Your account has been deactivated. Please contact support.');
    }

    logger.info(`User logged in: ${user.email}`);

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        user: {
          id: user._id,
          fullName: user.fullName,
          email: user.email,
          role: user.role,
          isVerified: user.isVerified,
          avatar: user.avatar,
        },
        token: generateToken(user._id),
        refreshToken: generateRefreshToken(user._id),
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    res.status(200).json({
      success: true,
      data: {
        user: {
          id: user._id,
          fullName: user.fullName,
          email: user.email,
          phone: user.phone,
          role: user.role,
          isVerified: user.isVerified,
          avatar: user.avatar,
          addresses: user.addresses,
          wishlist: user.wishlist,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Refresh access token
// @route   POST /api/auth/refresh-token
// @access  Public
const refreshToken = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      res.status(401);
      throw new Error('Refresh token is required');
    }

    // Verify refresh token
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
      res.status(401);
      throw new Error('User not found');
    }

    if (!user.isActive) {
      res.status(403);
      throw new Error('Account is deactivated');
    }

    res.status(200).json({
      success: true,
      data: {
        token: generateToken(user._id),
        refreshToken: generateRefreshToken(user._id),
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Request password reset
// @route   POST /api/auth/forgot-password
// @access  Public
const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      // Return success even if user doesn't exist (security best practice)
      return res.status(200).json({
        success: true,
        message: 'If an account exists with that email, a password reset link has been sent.',
      });
    }

    // Generate reset token
    const resetToken = generateRandomToken();
    user.resetPasswordToken = hashToken(resetToken);
    user.resetPasswordExpires = Date.now() + 60 * 60 * 1000; // 1 hour
    await user.save();

    // Send password reset email
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
    try {
      await sendPasswordReset(
        { email: user.email, name: user.fullName },
        resetToken,
        resetUrl
      );
      logger.info(`Password reset email sent to: ${user.email}`);
    } catch (emailError) {
      logger.error('Failed to send password reset email:', emailError);
      // Clear reset token if email fails
      user.resetPasswordToken = undefined;
      user.resetPasswordExpires = undefined;
      await user.save();
      
      return res.status(500).json({
        success: false,
        message: 'Failed to send password reset email. Please try again.',
      });
    }

    res.status(200).json({
      success: true,
      message: 'If an account exists with that email, a password reset link has been sent.',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Reset password
// @route   POST /api/auth/reset-password
// @access  Public
const resetPassword = async (req, res, next) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      res.status(400);
      throw new Error('Token and new password are required');
    }

    // Find user by reset token
    const hashedToken = hashToken(token);
    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      res.status(400);
      throw new Error('Invalid or expired reset token');
    }

    // Update password
    user.password = newPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    logger.info(`Password reset successful for: ${user.email}`);

    res.status(200).json({
      success: true,
      message: 'Password reset successful. You can now login with your new password.',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Verify email
// @route   GET /api/auth/verify-email/:token
// @access  Public
const verifyEmail = async (req, res, next) => {
  try {
    const { token } = req.params;

    const hashedToken = hashToken(token);
    const user = await User.findOne({
      verificationToken: hashedToken,
      verificationTokenExpires: { $gt: Date.now() },
    });

    if (!user) {
      res.status(400);
      throw new Error('Invalid or expired verification token');
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpires = undefined;
    await user.save();

    logger.info(`Email verified for: ${user.email}`);

    res.status(200).json({
      success: true,
      message: 'Email verified successfully!',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Resend verification email
// @route   POST /api/auth/resend-verification
// @access  Private
const resendVerificationEmail = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      res.status(404);
      throw new Error('User not found');
    }

    if (user.isVerified) {
      res.status(400);
      throw new Error('Email is already verified');
    }

    // Generate new verification token
    const verificationToken = generateRandomToken();
    user.verificationToken = hashToken(verificationToken);
    user.verificationTokenExpires = Date.now() + 24 * 60 * 60 * 1000; // 24 hours
    await user.save();

    // Send verification email
    const verificationUrl = `${process.env.FRONTEND_URL}/verify-email?token=${verificationToken}`;
    try {
      await sendVerificationEmail(
        { email: user.email, name: user.fullName },
        verificationToken,
        verificationUrl
      );
      logger.info(`Verification email resent to: ${user.email}`);
      
      res.status(200).json({
        success: true,
        message: 'Verification email sent successfully. Please check your inbox.',
      });
    } catch (emailError) {
      logger.error('Failed to resend verification email:', emailError);
      res.status(500);
      throw new Error('Failed to send verification email. Please try again later.');
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  getMe,
  refreshToken,
  forgotPassword,
  resetPassword,
  verifyEmail,
  resendVerificationEmail,
};
