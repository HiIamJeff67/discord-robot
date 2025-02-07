import { registerAs } from '@nestjs/config';

export default registerAs('jwtRefresh', () => ({
  secret: process.env.JWT_REFRESH_SECRET,
  expiresIn: process.env.JWT_REFRESH_TOKEN_EXPIRED_TIME,
}));
