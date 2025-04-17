import { Types } from "mongoose";
import { IFollowerDto, IMessageRequest } from "../../util/interfaces";
import { Conversation } from "../models/conversation";
import { Message } from "../models/message";
import { IProfile } from "../models/profile";
import { IUser, User } from "../models/user";

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
};

export const getAllConversationQuery = async (
  senderId: string,
  receiverId: string
) => {
  return await Conversation.findOne({
    participants: { $all: [senderId, receiverId] },
  }).sort({ createdAt: 1 });
};

export const createConversationQuery = async (
  senderId: string,
  receiverId: string
) => {
  const convo = new Conversation({
    participants: [new Types.ObjectId(senderId), new Types.ObjectId(receiverId)],
    messages: [],
  });
  await convo.save();
  return convo;
};

export const getChatPartnersQuery = async (senderId: string) => {
  const conversations = await Conversation.find({
    participants: { $in: [senderId] },
  }).populate({
    path: "participants",
    select: "userName _id followers",
    populate: {
      path: "profile",
      select: "profilePicture",
    },
  });

  const chatPartners = conversations.flatMap((conv) =>
    conv.participants.filter((user) => user._id.toString() !== senderId)
  );

  let res: IFollowerDto[] = [];
  (chatPartners as IUser[]).forEach(({ _id, profile, userName, followers }) => {
    res.push({
      userId: _id.toString(),
      profilePicture: (profile as IProfile).profilePicture,
      isFollowing: (followers as Types.ObjectId[]).includes(new Types.ObjectId(senderId)),
      userName,
    });
  });

  return res;
};

export const getMessageByIdQuery = async (messageId: string) => {
  return await Message.findById(messageId);
};

export const editMessageQuery = async (messageId: string, newContent: string) => {
  return await Message.findByIdAndUpdate(
    messageId,
    { content: newContent, isEdited: true, updatedAt: new Date() }, 
    { new: true }
  );
};

export const deleteMessageByIdQuery = async (messageId: string) => {
  return await Message.findByIdAndDelete(messageId);
};