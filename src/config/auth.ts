export interface AuthConfig {
  saltRounds: number;
}

export const authConfig: AuthConfig = {
  saltRounds: parseInt(process.env.BCRYPT_SALT_ROUNDS ?? '10', 10),
};
