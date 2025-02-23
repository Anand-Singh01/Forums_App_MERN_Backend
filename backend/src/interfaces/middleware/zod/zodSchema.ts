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
    .refine((val) => val.toLowerCase() === 'true' || val.toLowerCase() === 'false', {
      message:"Invalid isImageUpdated value."
    })
    // .transform((val) => val.toLowerCase === 'true')
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
  commentId: z
    .string()
    .transform((val) => String(val))
    .refine((val) => ObjectId.isValid(val), {
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
