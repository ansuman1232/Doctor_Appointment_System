import jwt from 'jsonwebtoken';

// Short-lived access token
export const generateAccessToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role }, 
    process.env.ACCESS_TOKEN_SECRET, 
    { expiresIn: '15m' }
  );
};

// Long-lived refresh token
export const generateRefreshToken = (user) => {
  return jwt.sign(
    { id: user._id }, 
    process.env.REFRESH_TOKEN_SECRET, 
    { expiresIn: '7d' }
  );
};
