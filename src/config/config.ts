import { registerAs } from "@nestjs/config";

export enum ConfigKeys {
  App = "App",
  Db = "Db",
  Jwt = "Jwt",
  OpenAI="OpenAi",
  Zarinpal="Zarinpal"
}

const AppConfig = registerAs(ConfigKeys.App, () => ({
  port: parseInt(process.env.APP_PORT as string, 10) || 3000,
}));

const JwtConfig = registerAs(ConfigKeys.Jwt, () => ({
  accessTokenSecret: process.env.ACCESS_TOKEN_SECRET,
  refreshTokenSecret: process.env.REFRESH_TOKEN_SECRET,
}));

const OpenAIConfig = registerAs(ConfigKeys.OpenAI, () => ({
    apiKey: process.env.OPENAI_API_KEY,
}));

const ZarinpalConfig = registerAs(ConfigKeys.Zarinpal, () => ({
  requestUrl: process.env.ZARINPAL_REQUEST_URL,
  merchandId: process.env.ZARINPAL_MERCHANT_ID,
  verifyUrl: process.env.ZARINPAL_VERIFY_URL,
  calbackUrl: process.env.ZARINPAL_CALBACK_URL,
}));

const DbConfig = registerAs(ConfigKeys.Db, () => ({
  uri:process.env.DB_URI,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
}));

export const configurations = [AppConfig, DbConfig, JwtConfig,OpenAIConfig,ZarinpalConfig];
