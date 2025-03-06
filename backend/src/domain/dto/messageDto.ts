import { IConversationDto } from "../../util/interfaces";
import { IConversation } from "../models/conversation";
import { IMessage } from "../models/message";
import { IUser } from "../models/user";

export const messageDto = (conversation: IConversation) => {
  const messages = conversation.messages as IMessage[];
  let participants = conversation.participants as IUser[];
  const modifiedParticipants = participants.map(
    ({ _id, profile, userName }) => {
      return {
        userId: _id.toString(),
        userName,
        // profilePicture: (profile as IProfile).profilePicture,
      };
    }
  );
  const modifiedMessages = messages.map(
    ({ _id, content, isEdited, sender, createdAt }) => {
      return {
        messageId: _id.toString(),
        content,
        isEdited,
        senderId: sender._id.toString(),
        createdAt,
      };
    }
  );
  const res = {
    conversationId: conversation._id.toString(),
    participants: modifiedParticipants,
    messages: modifiedMessages,
  } as IConversationDto;
  return res;
};