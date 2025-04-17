import { Types } from "mongoose";
import { IProfile } from "../../domain/models/profile";
import { User } from "../../domain/models/user";
import {
  createDefaultProfileQuery,
  deleteProfileQuery,
  getAllProfilesQuery,
  getFollowerCount,
  getFollowingCount,
  getProfileByUserIdQuery,
  updateProfileQuery,
} from "../../domain/queries/profile";
import { IUpdateProfileData, ServiceResponse } from "../../util/interfaces";

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
  userId: string,
  currentUserId:string
): Promise<ServiceResponse> => {
  let response: ServiceResponse = {
    message: "Profile retrieved successfully",
    status: true,
    statusCode: 200,
    data: null,
  };

  try {

    const user = await User.findById(userId);
    const profile : IProfile | null = await getProfileByUserIdQuery(user!.profile._id.toString());
    const followerCount = await getFollowerCount(userId);
    const followingCount = await getFollowingCount(userId);
    if (!profile) {
      response.statusCode = 404;
      throw new Error("Profile not found.");
    }

    response.data = {
      _id: profile._id.toString(),
      profileName: profile.profileName,
      profilePicture: profile.profilePicture,
      profileDescription: profile.profileDescription,
      followersCount: followerCount,
      followingCount,
      isFollowing: (user?.followers as Types.ObjectId[]).some( id => id.equals(currentUserId)),
      postsCount: user!.writtenPosts.length 
    }
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