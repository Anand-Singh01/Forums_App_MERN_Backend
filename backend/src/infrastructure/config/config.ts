import dotenv from 'dotenv';

dotenv.config();

const ENVIRONMENT = process.env.NODE_ENV ?? "development";

const MONGO_URL = process.env.DATABASE_URL;

const config = {
  environment: ENVIRONMENT,
  mongo: {
    url: MONGO_URL
  }
}

export default config;