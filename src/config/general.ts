if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE-URL não foi definida no .env');
}

export interface AppConfig {
  port: number;
  databaseUrl: string;
}

export const appConfig: AppConfig = {
  port: parseInt(process.env.PORT ?? '3000', 10),
  databaseUrl: process.env.DATABASE_URL,
};
