import { messageDto } from "../../domain/dto/messageDto";
import { User } from "../../domain/models/user";
import {
    getAllConversationQuery,
    getChatPartnersQuery,
} from "../../domain/queries/conversation";
import { ServiceResponse } from "../../util/interfaces";

export const getAllConversation = async (
  senderId: string,
  receiverId: string
) => {
  let response: ServiceResponse = {
    message: "success",
    status: true,
    statusCode: 200,
    data: null,
  };

  try {
    const sender = await User.findById(senderId);
    const receiver = await User.findById(receiverId);
    if (!sender || !receiver) {
      throw new Error("invalid credentials");
    }
    const conversation = await getAllConversationQuery(senderId, receiverId);
    if (conversation) {
      response.data = messageDto(conversation);
    } else {
      response.message = "no conversation exists with this user";
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

export const getChatPartners = async (senderId: string) => {
  let response: ServiceResponse = {
    message: "success",
    status: true,
    statusCode: 200,
    data: null,
  };

  try {
    const users = await getChatPartnersQuery(senderId);
    response.data = users;
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