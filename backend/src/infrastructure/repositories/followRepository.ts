import { followerDto } from "../../domain/dto/followersDto";
import { IUser } from "../../domain/models/user";
import {
    getFollowersListQuery,
    getFollowingListQuery,
    updateFollowQuery,
} from "../../domain/queries/follow";
import { IFollowerDto, ServiceResponse } from "../../util/interfaces";

export const updateFollow = async (userId: string, friendId: string) => {
  let response: ServiceResponse = {
    message: "success",
    status: true,
    statusCode: 200,
    data: null,
  };

  try {
    const res = await updateFollowQuery(userId, friendId);
    response.data = res;
  } catch (error) {
    response.status = false;
    response.message = (error as Error).message || "unexpected error occurred";
    if (!response.statusCode || response.statusCode === 200) {
      response.statusCode = 500;
    }
    response.data = null;
  }
  return response;
};

export const followersList = async (userId: string) => {
  let response: ServiceResponse = {
    message: "success",
    status: true,
    statusCode: 200,
    data: null,
  };

  try {
    const followers = (await getFollowersListQuery(userId)) as IUser[];
    let modifiedFollowers = [] as IFollowerDto[];
    followers.forEach((user) => {
      modifiedFollowers.push(followerDto(user));
    });
    response.data = modifiedFollowers;
  } catch (error) {
    response.status = false;
    response.message = (error as Error).message || "unexpected error occurred";
    if (!response.statusCode || response.statusCode === 200) {
      response.statusCode = 500;
    }
    response.data = null;
  }
  return response;
};

export const followingList = async (userId: string) => {
  let response: ServiceResponse = {
    message: "success",
    status: true,
    statusCode: 200,
    data: null,
  };

  try {
    const followers = (await getFollowingListQuery(userId)) as IUser[];
    let modifiedFollowers = [] as IFollowerDto[];
    followers.forEach((user) => {
      modifiedFollowers.push(followerDto(user));
    });
    response.data = modifiedFollowers;
  } catch (error) {
    response.status = false;
    response.message = (error as Error).message || "unexpected error occurred";
    if (!response.statusCode || response.statusCode === 200) {
      response.statusCode = 500;
    }
    response.data = null;
  }
  return response;
};