import { ObjectId } from "mongodb";
import { z } from "zod";

// Post
export const addPostSchema = z.object({
  caption: z
    .string({ required_error: "Caption is required" })
    .min(2, { message: "Caption should be at least 2 characters long." })
    .max(500, { message: "Caption can be at most 500 characters long." }),
  region: z
    .string()
    .max(20, { message: "Location can be at most 20 characters long." })
    .nullable()
    .optional(),
});

export const updatePostSchema = z.object({
  postId: z.string().refine((val) => ObjectId.isValid(val), {
    message: "Invalid PostId",
  }),
  caption: z
    .string({ required_error: "Caption is required" })
    .min(1, { message: "Caption should be at least 1 characters long." })
    .max(2000, { message: "Caption can be at most 2000 characters long." }),
  region: z
    .string()
    .max(100, { message: "Location can be at most 100 characters long." })
    .nullable()
    .optional(),
  isImageUpdated: z
    .string()
    .refine(
      (val) => val.toLowerCase() === "true" || val.toLowerCase() === "false",
      {
        message: "Invalid isImageUpdated value.",
      })
});

export const deletePostSchema = z.object({
  postId: z.string().refine((val) => ObjectId.isValid(val), {
    message: "Invalid PostId",
  }),
});

export const getPostByIdSchema = z.object({
  postId: z.string().refine((val) => ObjectId.isValid(val), {
    message: "Invalid PostId",
  }),
});

// Comment
export const addCommentSchema = z.object({
  postId: z.string().refine((val) => ObjectId.isValid(val), {
    message: "Invalid PostId",
  }),
  comment: z
    .string({ required_error: "Comment is required" })
    .min(1, { message: "Comment is required." })
    .max(2000, { message: "Comment can be at most 2000 characters long." }),
});

export const getAllCommentsSchema = z.object({
  postId: z
    .string()
    .transform((val) => String(val))
    .refine((val) => ObjectId.isValid(val), {
      message: "Invalid PostId",
    }),
});

export const updateCommentSchema = z.object({
  commentId: z
    .string()
    .transform((val) => String(val))
    .refine((val) => ObjectId.isValid(val), {
      message: "Invalid CommentId",
    }),
  comment: z
    .string({ required_error: "Comment is required" })
    .min(1, { message: "Comment is required." })
    .max(2000, { message: "Comment can be at most 2000 characters long." }),
});

export const deleteCommentSchema = z.object({
  commentId: z
    .string()
    .transform((val) => String(val))
    .refine((val) => ObjectId.isValid(val), {
      message: "Invalid CommentId",
    }),
});

export const addReplySchema = z.object({
  commentId: z
    .string()
    .transform((val) => String(val))
    .refine((val) => ObjectId.isValid(val), {
      message: "Invalid CommentId",
    }),
  reply: z
    .string({ required_error: "Reply is required" })
    .min(1, { message: "Reply is required." })
    .max(2000, { message: "Reply can be at most 2000 characters long." }),
});

export const getAllReplySchema = z.object({
  commentId: z.string().refine((val) => ObjectId.isValid(val), {
    message: "Invalid commentId",
  }),
});

export const updateReplySchema = z.object({
  replyId: z
    .string()
    .transform((val) => String(val))
    .refine((val) => ObjectId.isValid(val), {
      message: "Invalid ReplyId",
    }),
  reply: z
    .string({ required_error: "reply is required" })
    .min(1, { message: "reply is required." })
    .max(2000, { message: "reply can be at most 2000 characters long." }),
});

export const deleteReplySchema = z.object({
  replyId: z
    .string()
    .transform((val) => String(val))
    .refine((val) => ObjectId.isValid(val), {
      message: "Invalid ReplyId",
    }),
});

// follow
export const updateFollowSchema = z.object({
  friendId: z.string().refine((val) => ObjectId.isValid(val), {
    message: "Invalid FriendId",
  }),
});

// message
export const addMessageSchema = z.object({
  senderId: z.string().refine((val) => ObjectId.isValid(val), {
    message: "Invalid SenderId",
  }),
  receiverId: z.string().refine((val) => ObjectId.isValid(val), {
    message: "Invalid receiverId",
  }),
  message: z
    .string({ required_error: "Message is required" })
    .min(1, { message: "Message is required." }),
});

export const getAllMessageSchema = z.object({
  receiverId: z.string().refine((val) => ObjectId.isValid(val), {
    message: "Invalid receiverId",
  }),
});

export const editMessageSchema = z.object({
  messageId: z.string().refine((val) => ObjectId.isValid(val), {
    message: "Invalid messageId",
  }),
  newContent: z
    .string({ required_error: "Message is required" })
    .min(1, { message: "Message is required." }),
});

export const deleteMessageSchema = z.object({
  messageId: z.string().refine((val) => ObjectId.isValid(val), {
    message: "Invalid messageId",
  }),
});


// Saveing Posts
export const savePostSchema = z.object({
  postId: z
  .string()
  .refine((val) => ObjectId.isValid(val), {
    message: "Invalid PostId",
  }),
});

export const unsavePostSchema = z.object({
  postId: z.string().refine((val) => ObjectId.isValid(val), {
    message: "Invalid PostId",
  }),
});

export const getAllSavedPostSchema = z.object({
  userId: z.string().refine((val) => ObjectId.isValid(val), {
    message: "Invalid userId",
  }),
});




// Liking Posts
export const likePostSchema = z.object({
  commentId: z
  .string()
  .refine((val) => ObjectId.isValid(val), {
    message: "Invalid PostId",
  }),
});

export const unlikePostSchema = z.object({
  postId: z.string().refine((val) => ObjectId.isValid(val), {
    message: "Invalid PostId",
  }),
});

export const getAllLikedPostSchema = z.object({
  userId: z.string().refine((val) => ObjectId.isValid(val), {
    message: "Invalid userId",
  }),
});


//Create Profile Scheme 
export const createProfileSchema = z.object({
  profileName: z.string({ required_error: "Profile name is required" }),
  profileDescription: z.string().optional(),
  user: z.string().refine((val) => ObjectId.isValid(val), {
    message: "Invalid User ID",
  }),
});

//Update Profile Scheme 

export const updateProfileSchema = z.object({
  name: z.string({ required_error: "Name is required" }),
  description: z.string().optional(),
  isImageUpdated: z
    .string()
    .refine(
      (val) => val.toLowerCase() === "true" || val.toLowerCase() === "false",
      {
        message: "Invalid isImageUpdated value.",
      }
    ),
});

//Delete Profile Scheme 

export const deleteProfileSchema = z.object({
  userId: z.string().refine((val) => ObjectId.isValid(val), {
    message: "Invalid User ID",
  }),
});

//Get Profile Scheme 
export const getProfileByIdSchema = z.object({
  userId: z.string().refine((val) => ObjectId.isValid(val), {
    message: "Invalid User ID",
  }),
});


  // Add Feedback Schema
export const addFeedbackSchema = z.object({
  header: z.string({ required_error: "Header is required" })
    .min(2, { message: "Header should be at least 2 characters long." })
    .max(100, { message: "Header can be at most 100 characters long." }),
  description: z.string({ required_error: "Description is required" })
    .min(10, { message: "Description should be at least 10 characters long." })
    .max(2000, { message: "Description can be at most 2000 characters long." }),
});

// Update Feedback Schema
export const updateFeedbackSchema = z.object({
  feedbackId: z.string().refine((val) => ObjectId.isValid(val), {
    message: "Invalid Feedback ID",
  }),
  header: z.string({ required_error: "Header is required" })
    .min(2, { message: "Header should be at least 2 characters long." })
    .max(100, { message: "Header can be at most 100 characters long." }),
  description: z.string({ required_error: "Description is required" })
    .min(10, { message: "Description should be at least 10 characters long." })
    .max(2000, { message: "Description can be at most 2000 characters long." }),
});

// Delete Feedback Schema
export const deleteFeedbackSchema = z.object({
  feedbackId: z.string().refine((val) => ObjectId.isValid(val), {
    message: "Invalid Feedback ID",
  }),
});

// Get Feedback by ID Schema
export const getFeedbackByIdSchema = z.object({
  feedbackId: z.string().refine((val) => ObjectId.isValid(val), {
    message: "Invalid Feedback ID",
  }),
});

// Get All Feedback by User ID Schema
export const getAllFeedbackByUserIdSchema = z.object({
  userId: z.string().refine((val) => ObjectId.isValid(val), {
    message: "Invalid User ID",
  }),
});
