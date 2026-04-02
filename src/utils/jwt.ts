import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-for-development';
const JWT_EXPIRATION = '7d';

export interface JwtPayload {
  userId: string;
  email: string;
}

export const generateToken = (userId: string, email: string): string => {
  const payload: JwtPayload = {
    userId,
    email,
  };

  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRATION,
  });
};

export const verifyToken = (token: string): JwtPayload => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
    return decoded;
  } catch (error) {
    throw new Error('Invalid or expired token');
  }
};
