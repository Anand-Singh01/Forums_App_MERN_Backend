import models from "../domain";
import config from "./config/config";
import cloudinary from "./database/cloudinary/connection";

const dependencies = {
  config: config,
  cloud:cloudinary,
  models:models
};

export default dependencies;