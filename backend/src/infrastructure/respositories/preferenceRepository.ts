import { IUpdateProfileData, ServiceResponse } from "../../util/interfaces";
import dependencies from "../dependencies";

export const updateProfile = async (
  userId: string,
  data: IUpdateProfileData,
  fileContent: string | undefined
): Promise<ServiceResponse> => {
  let response: ServiceResponse = {
    message: "Profile updated successfully",
    status: true,
    statusCode: 200,
    data: null,
  };

  try {
    const profile = await dependencies.models.Profile.findOne({ user: userId });
    if (!profile) {
      response.statusCode = 404;
      throw new Error("Profile not found.");
    }

    profile.profileName = data.name; 
    profile.profileDescription = data.description; 

    if (data.isImageUpdated && fileContent) {
      const myCloud = await dependencies.cloud.v2.uploader.upload(fileContent); 
      profile.profilePicture = myCloud.secure_url; 
    }

    await profile.save();

    response.data = profile;
  } catch (error) {
    response.status = false;
    response.message = (error as Error).message || "An unexpected error occurred";
    if (!response.statusCode || response.statusCode === 200) {
      response.statusCode = 500;
    }
    response.data = null;
  }

  return response;
};