import { registerAs } from '@nestjs/config';
import { ExtractJwt } from 'passport-jwt';

export default registerAs('jwtAccess', () => ({
  secret: process.env.JWT_SECRET,
  expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRED_TIME,
}));
