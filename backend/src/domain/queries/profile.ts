import dependencies from "../../infrastructure/dependencies";
import { IUpdateProfileData } from "../../util/interfaces";

export const saveImageOnCloud = async (fileContent: string) => {
  const myCloud = await dependencies.cloud.v2.uploader.upload(fileContent);
  return myCloud.secure_url;
};

export const createDefaultProfileQuery = async (userId: string, userName: string) => {
  const profile = new dependencies.models.Profile({
    profileName: userName,
    profileDescription: "",
    user: userId,
  });
  return await profile.save();
};

export const getProfileByUserIdQuery = async (userId: string) => {
  return await dependencies.models.Profile.findOne({ user: userId });
};

export const updateProfileQuery = async (
  userId: string,
  data: IUpdateProfileData,
  fileContent: string | undefined
) => {
  const profile = await dependencies.models.Profile.findOne({ user: userId });
  if (!profile) {
    throw new Error("Profile not found.");
  }

  profile.profileName = data.name;
  profile.profileDescription = data.description;

  if (data.isImageUpdated && fileContent) {
    const imageUrl = await saveImageOnCloud(fileContent);
    if (!imageUrl) {
      throw new Error("Error saving the image.");
    }
    profile.profilePicture = imageUrl;
  }

  await profile.save();
  return profile;
};

export const deleteProfileQuery = async (userId: string) => {
  return await dependencies.models.Profile.findOneAndDelete({ user: userId });
};

export const getAllProfilesQuery = async () => {
  return await dependencies.models.Profile.find();
};