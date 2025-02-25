import { Types } from "mongoose";
import { IMessageRequest } from "../../util/interfaces";
import { Conversation } from "../models/conversation";
import { Message } from "../models/message";
import { User } from "../models/user";

export const addMessageQuery = async (data: IMessageRequest) => {
  
  const { message, receiverId, senderId } = data;

  const sender = await User.findById(senderId);
  const receiver = await User.findById(receiverId);
  if (!sender || !receiver) {
    throw new Error("Invalid user ID");
  }

  let conversation = await Conversation.findOne({
    participants: { $all: [sender._id, receiver._id] },
  });

  const msg = new Message({
    content: message,
    sender: sender._id,
  });

  await msg.save();

  if (conversation) {
    (conversation.messages as Types.ObjectId[]).push(msg._id);
  } else {
    conversation = new Conversation({
      participants: [sender._id, receiver._id],
      messages: [msg._id],
    });
  }

  await conversation.save();
  console.log("Saved...");
};
