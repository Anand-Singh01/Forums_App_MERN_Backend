import { ObjectId } from "mongodb";
import { z } from "zod";
export const addPostSchema = z.object({
  caption: z
    .string({ required_error: "Caption is required" })
    .min(2, { message: "Caption should be at least 2 characters long." })
    .max(500, { message: "Caption can be at most 500 characters long." }),
  location: z
    .string()
    .max(20, { message: "Location can be at most 20 characters long." })
    .nullable()
    .optional(),
});

export const updatePostSchema = z.object({
  postId: z.instanceof(ObjectId, { message: "Invalid PostId" }),
  caption: z
    .string({ required_error: "Caption is required" })
    .min(1, { message: "Caption should be at least 1 characters long." })
    .max(500, { message: "Caption can be at most 500 characters long." }),
  location: z
    .string()
    .max(20, { message: "Location can be at most 20 characters long." })
    .nullable()
    .optional(),
  isImageUpdated: z.boolean({ required_error: "isImageUpdated is required" }),
});

export const deletePostSchema = z.object({
  postId: z.instanceof(ObjectId, { message: "Invalid PostId" }),
});

export const getPostByIdSchema = z.object({
  postId: z.instanceof(ObjectId, { message: "Invalid PostId" }),
});