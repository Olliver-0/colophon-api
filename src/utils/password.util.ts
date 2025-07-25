import bcrypt from 'bcryptjs';
import config from '#/config/index.js';

export const hashPassword = async (password: string): Promise<string> => {
  const salt = await bcrypt.genSalt(config.auth.saltRounds);
  return bcrypt.hash(password, salt);
};

export const comparePassword = async (password: string, hash: string): Promise<boolean> => {
  return bcrypt.compare(password, hash);
};
