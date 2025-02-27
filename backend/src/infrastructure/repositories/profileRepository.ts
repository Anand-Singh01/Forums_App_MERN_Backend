import { IUpdateProfileData, ServiceResponse } from "../../util/interfaces";
import dependencies from "../dependencies";

export const createDefaultProfile = async (
  userId: string,
  userName: string
): Promise<ServiceResponse> => {
  let response: ServiceResponse = {
    message: "Default profile created successfully",
    status: true,
    statusCode: 201,
    data: null,
  };

  try {
    const profile = new dependencies.models.Profile({
      profileName: userName,
      profileDescription: "",
      user: userId,
    });

    const savedProfile = await profile.save();
    response.data = savedProfile;
  } catch (error) {
    response.status = false;
    response.message = (error as Error).message || "Failed to create default profile";
    response.statusCode = 500;
    response.data = null;
  }

  return response;
};

export const getProfile = async (
  userId: string
): Promise<ServiceResponse> => {
  let response: ServiceResponse = {
    message: "Profile retrieved successfully",
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

    response.data = profile;
  } catch (error) {
    response.status = false;
    response.message = (error as Error).message || "Failed to retrieve profile";
    if (!response.statusCode || response.statusCode === 200) {
      response.statusCode = 500;
    }
    response.data = null;
  }

  return response;
};

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
    response.message = (error as Error).message || "Failed to update profile";
    if (!response.statusCode || response.statusCode === 200) {
      response.statusCode = 500;
    }
    response.data = null;
  }

  return response;
};

export const deleteProfile = async (
  userId: string
): Promise<ServiceResponse> => {
  let response: ServiceResponse = {
    message: "Profile deleted successfully",
    status: true,
    statusCode: 200,
    data: null,
  };

  try {
    const deletedProfile = await dependencies.models.Profile.findOneAndDelete({ user: userId });
    if (!deletedProfile) {
      response.statusCode = 404;
      throw new Error("Profile not found.");
    }

    response.data = deletedProfile;
  } catch (error) {
    response.status = false;
    response.message = (error as Error).message || "Failed to delete profile";
    if (!response.statusCode || response.statusCode === 200) {
      response.statusCode = 500;
    }
    response.data = null;
  }

  return response;
};