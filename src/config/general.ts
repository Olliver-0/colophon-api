if (!process.env.DATABASE_URL) {
  throw new Error('FATAL ERROR: DATABASE_URL is not defined in the .env file.');
}

export interface AppConfig {
  port: number;
  frontend: string | undefined;
  databaseUrl: string;
}

export const appConfig: AppConfig = {
  port: parseInt(process.env.PORT ?? '3000', 10),
  databaseUrl: process.env.DATABASE_URL,
  frontend: process.env.FRONTEND_URL,
};
