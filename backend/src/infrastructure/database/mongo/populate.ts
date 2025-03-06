import { Document } from "mongoose";
import { IComment } from "../../../domain/models/comment";
import { IConversation } from "../../../domain/models/conversation";
import { IPost } from "../../../domain/models/post";
import { IReply } from "../../../domain/models/reply";

export const populateComment = async (
  comment: Document<unknown, {}, IComment> & IComment
) => {
  return await comment.populate({
    path: "commentedBy",
    select: "profile userName",
    populate: {
      path: "profile",
      select: "profilePicture",
    },
  });
};

export const populateMultipleComments = async (
  comments: (Document<unknown, {}, IComment> & IComment)[]
) => {
  return Promise.all(
    comments.map((comment) =>
      comment.populate({
        path: "commentedBy",
        select: "profile userName",
        populate: {
          path: "profile",
          select: "profilePicture",
        },
      })
    )
  );
};

export const populateReply = async (
  reply: Document<unknown, {}, IReply> & IReply
) => {
  return await reply.populate({
    path: "replyFrom",
    select: "profile userName",
    populate: {
      path: "profile",
      select: "profilePicture",
    },
  });
};

export const populateMultipleReply = async (
  reply: (Document<unknown, {}, IReply> & IReply)[]
) => {
  return Promise.all(
    reply.map((r) =>
      r.populate({
        path: "replyFrom",
        select: "profile userName",
        populate: {
          path: "profile",
          select: "profilePicture",
        },
      })
    )
  );
};

export const populatePost = async (
  post: Document<unknown, {}, IPost> & IPost
) => {
  return await post.populate({
    path: "postedBy",
    select: "profile userName",
    populate: {
      path: "profile",
      select: "profilePicture",
    },
  });
};

export const populateMultiplePost = async (
  posts: (Document<unknown, {}, IPost> & IPost)[]
) => {
  return Promise.all(
    posts.map((p) => {
      p.populate({
        path: "postedBy",
        select: "profile userName",
        populate: {
          path: "profile",
          select: "profilePicture",
        },
      });
    })
  );
};

export const populateConversations = async (
  conversation: Document<unknown, {}, IConversation> & IConversation
) => {
  return conversation.populate([
    { path: "messages", select: "content isEdited sender createdAt" },
    { 
      path: "participants", 
      select: "userName _id",
      populate: { path: "profile", select: "profilePicture" }
    }
  ]);  
};