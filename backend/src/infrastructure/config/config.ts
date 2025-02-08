import dotenv from "dotenv";

dotenv.config();

const ENVIRONMENT = process.env.NODE_ENV ?? "development";

const MONGO_URL = process.env.DATABASE_URL;
const CLIENT_URL = process.env.CLIENT_URL;
const COOKIE_SECRET = process.env.COOKIE_SECRET;
const JWT_SECRET = process.env.JWT_SECRET;
const COOKIE_NAME = process.env.COOKIE_NAME;
const CLOUD_API_KEY = process.env.CLOUD_API_KEY;
const CLOUD_NAME = process.env.CLOUD_NAME;
const CLOUD_SECRET = process.env.CLOUD_SECRET;

const config = {
  environment: ENVIRONMENT,
  mongo: {
    url: MONGO_URL,
  },
  cloud: {
    apiKey: CLOUD_API_KEY,
    name: CLOUD_NAME,
    secret: CLOUD_SECRET,
  },
  cookie: {
    cookieName: COOKIE_NAME,
    cookieSecret: COOKIE_SECRET,
    jwtSecret: JWT_SECRET,
  },
  client: {
    url: CLIENT_URL,
  },
};

export default config;