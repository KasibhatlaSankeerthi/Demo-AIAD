const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const asyncWrapper = require('../utils/asyncWrapper');
const AppError = require('../utils/AppError');
const { findUserByEmail } = require('../services/authService');

const login = asyncWrapper(async (req, res) => {
  const { email, password } = req.body || {};

  if (!email || !password) {
    throw new AppError('Email and password are required', 400);
  }

  const normalizedEmail = String(email).trim().toLowerCase();
  if (!normalizedEmail) {
    throw new AppError('Email and password are required', 400);
  }

  const user = await findUserByEmail(normalizedEmail);
  if (!user) {
    throw new AppError('Invalid email or password', 401);
  }

  if (Number(user.account_status) === 0) {
    throw new AppError('Account is suspended', 403);
  }

  if (Number(user.is_deleted) === 1) {
    throw new AppError('Account is deleted', 403);
  }

  const passwordMatches = await bcrypt.compare(String(password), user.password_hash);
  if (!passwordMatches) {
    throw new AppError('Invalid email or password', 401);
  }

  const secret = process.env.JWT_ACCESS_SECRET;
  if (!secret) {
    throw new AppError('JWT_ACCESS_SECRET is not configured', 500);
  }

  const expiresIn = process.env.JWT_ACCESS_EXPIRES_IN || '15m';
  const accessToken = jwt.sign(
    {
      sub: user.id,
      role: user.role,
      email: user.email,
    },
    secret,
    { expiresIn }
  );

  return res.status(200).json({
    accessToken,
    user: {
      id: user.id,
      firstName: user.first_name,
      lastName: user.last_name,
      email: user.email,
      role: user.role,
    },
  });
});

module.exports = {
  login,
};
