if (!process.env.JWT_SECRET) throw new Error('FATAL ERROR: JWT_SECRET is not defined in the .env file.');

export interface AuthConfig {
  saltRounds: number;
  jwtSecret: string;
}

export const authConfig: AuthConfig = {
  saltRounds: parseInt(process.env.BCRYPT_SALT_ROUNDS ?? '10', 10),
  jwtSecret: process.env.JWT_SECRET,
};
