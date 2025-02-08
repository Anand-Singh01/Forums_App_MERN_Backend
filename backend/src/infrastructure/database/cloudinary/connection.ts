import cloudinary from "cloudinary";
import dependencies from "../../dependencies";

cloudinary.v2.config({
  cloud_name: dependencies.config.cloud.name,
  api_key: dependencies.config.cloud.apiKey,
  api_secret: dependencies.config.cloud.secret,
});

export default cloudinary;