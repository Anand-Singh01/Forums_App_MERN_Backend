import cloudinary from "cloudinary";
import config from "../../config/config";

cloudinary.v2.config({
  cloud_name: config.cloud.name,
  api_key: config.cloud.apiKey,
  api_secret: config.cloud.secret,
});

export default cloudinary;