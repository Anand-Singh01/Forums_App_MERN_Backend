import { followerDto } from "../../domain/dto/followersDto";
import { IUser } from "../../domain/models/user";
import {
  followQuery,
  getFollowersListQuery,
  getFollowingListQuery,
  isFollowing,
  unFollowQuery,
} from "../../domain/queries/follow";
import { getUserById } from "../../domain/queries/user";
import { IFollowerDto, ServiceResponse } from "../../util/interfaces";

// follow / unFollow user
export const updateFollow = async (userId: string, friendId: string) => {
  let response: ServiceResponse = {
    message: "success",
    status: true,
    statusCode: 200,
    data: null,
  };

  try {
    if(userId === friendId){
      throw new Error("Invalid action: You cannot follow your own account.");
    }
    const user = await getUserById(userId);
    const friend = await getUserById(friendId);
    if (!user) {
      throw new Error("Invalid userId");
    } else if (!friend) {
      throw new Error("Invalid friendId");
    }
    const isFollow = isFollowing(user, friend._id);
    if (isFollow) {
      await unFollowQuery(user, friend);
      response.data = { message: "unfollowed" };
    } else {
      await followQuery(user, friend);
      response.data = { message: "followed" };
    }
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

// get followers list
export const followersList = async (userId: string) => {
  let response: ServiceResponse = {
    message: "success",
    status: true,
    statusCode: 200,
    data: null,
  };

  try {
    const followers = (await getFollowersListQuery(userId)) as IUser[] | null;
    if (!followers) {
      throw new Error("User not found.");
    }
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

// get following list
export const followingList = async (userId: string) => {
  let response: ServiceResponse = {
    message: "success",
    status: true,
    statusCode: 200,
    data: null,
  };

  try {
    const following = (await getFollowingListQuery(userId)) as IUser[] | null;
    if (!following) {
      throw new Error("User not found.");
    }
    let modifiedFollowing = [] as IFollowerDto[];
    following.forEach((user) => {
      modifiedFollowing.push(followerDto(user));
    });
    response.data = modifiedFollowing;
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