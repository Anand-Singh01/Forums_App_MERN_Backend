import { messageDto } from "../../domain/dto/messageDto";
import { User } from "../../domain/models/user";
import {
  createConversationQuery,
  deleteMessageByIdQuery,
  editMessageQuery,
  getAllConversationQuery,
  getChatPartnersQuery,
  getMessageByIdQuery,
} from "../../domain/queries/conversation";
import { ServiceResponse } from "../../util/interfaces";
import { populateConversations } from "../database/mongo/populate";

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
      await populateConversations(conversation);
      response.data = messageDto(conversation);
    } else {
      const newConvo = await createConversationQuery(senderId, receiverId);
      await populateConversations(newConvo);
      response.data = messageDto(newConvo);
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

export const editMessage = async (
  messageId: string,
  newContent: string,
  userId: string) => {

    let response: ServiceResponse = {
      message: "success",
      status: true,
      statusCode: 200,
      data: null,
    };

    try{

      const message = await getMessageByIdQuery(messageId);

      if (!message) {
        response.statusCode = 404;
        throw new Error("message not found");
      }
      if (message.sender.toString() !== userId) {
        response.statusCode = 400;
        throw new Error("not allowed to edit");
      }
    
      const updatedMessage = await editMessageQuery(messageId, newContent);
    
      //await message.save();
      response.data = updatedMessage;

    }catch(error){
      response.status = false;
      response.message = (error as Error).message || "unexpected error occurred";
      if (!response.statusCode || response.statusCode === 200) {
        response.statusCode = 500;
      }
      response.data = null;
    }
    return response;
};

export const deleteMessage = async (messageId: string, userId: string) => {

  let response: ServiceResponse = {
    message: "success",
    status: true,
    statusCode: 200,
    data: null,
  };

  try{

    const message = await getMessageByIdQuery(messageId);
    if (!message) {
      response.statusCode = 404;
      throw new Error("message not found");
    }
    if (message.sender.toString() !== userId) {
      response.statusCode = 400;
      throw new Error("not allowed to delete");
    }
    await deleteMessageByIdQuery(messageId);
    response.message = "message deleted";
    response.data = message;

  }catch(error){
    response.status = false;
    response.message = (error as Error).message || "unexpected error occurred";
    if (!response.statusCode || response.statusCode === 200) {
      response.statusCode = 500;
    }
    response.data = null;
  }
  return response;
};