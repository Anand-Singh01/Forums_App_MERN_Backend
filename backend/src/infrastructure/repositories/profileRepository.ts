import { IUpdateProfileData, ServiceResponse } from "../../util/interfaces";
import {
  createDefaultProfileQuery,
  deleteProfileQuery,
  getAllProfilesQuery,
  getProfileByUserIdQuery,
  updateProfileQuery,
} from "../../domain/queries/profile";

export const createDefaultProfile = async (
  userId: string,
  userName: string
): Promise<ServiceResponse> => {
  let response: ServiceResponse = {
    message: "Default profile created successfully",
    status: true,
    statusCode: 200,
    data: null,
  };

  try {
    const profile = await createDefaultProfileQuery(userId, userName);
    response.data = profile;
  } catch (error) {
    response.status = false;
    response.message = (error as Error).message || "Failed to create default profile";
    if (!response.statusCode || response.statusCode === 200) {
      response.statusCode = 500;
    }
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
    const profile = await getProfileByUserIdQuery(userId);
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
    const profile = await updateProfileQuery(userId, data, fileContent);
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
    const deletedProfile = await deleteProfileQuery(userId);
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

export const getAllProfiles = async (): Promise<ServiceResponse> => {
  let response: ServiceResponse = {
    message: "Profiles retrieved successfully",
    status: true,
    statusCode: 200,
    data: null,
  };

  try {
    const profiles = await getAllProfilesQuery();
    response.data = profiles;
  } catch (error) {
    response.status = false;
    response.message = (error as Error).message || "Failed to retrieve profiles";
    if (!response.statusCode || response.statusCode === 200) {
      response.statusCode = 500;
    }
    response.data = null;
  }

  return response;
};