import { registerAs } from "@nestjs/config";

export enum ConfigKeys {
  App = "App",
  Db = "Db",
  Jwt = "Jwt",
}

const AppConfig = registerAs(ConfigKeys.App, () => ({
  port: parseInt(process.env.APP_PORT as string, 10) || 3000,
}));

const JwtConfig = registerAs(ConfigKeys.Jwt, () => ({
  accessTokenSecret: process.env.ACCESS_TOKEN_SECRET,
  refreshTokenSecret: process.env.REFRESH_TOKEN_SECRET,
}));

const DbConfig = registerAs(ConfigKeys.Db, () => ({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
}));

export const configurations = [AppConfig, DbConfig, JwtConfig];
