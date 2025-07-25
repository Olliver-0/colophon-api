import { appConfig, AppConfig } from './general.js';
import { authConfig, AuthConfig } from './auth.js';

export interface Config {
  app: AppConfig;
  auth: AuthConfig;
}

export const config: Config = {
  app: appConfig,
  auth: authConfig,
};

export default config;
