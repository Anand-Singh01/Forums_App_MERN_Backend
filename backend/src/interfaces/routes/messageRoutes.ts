import { Request, Response, Router } from "express";
import {
  getAllConversation,
  getChatPartners,
  editMessage,
  deleteMessage,
} from "../../infrastructure/repositories/messageRepostiory";
import { getAllMessagesValidation } from "../middleware/validation/message";
import { deleteMessageSchema, editMessageSchema } from "../middleware/zod/zodSchema";

const conversationRoutes = Router();

conversationRoutes.get(
  "/get-all-messages/:receiverId",
  getAllMessagesValidation,
  async (req: Request, res: Response) => {
    try {
      const { receiverId } = req.params;
      const { userId } = res.locals.jwtData;
      const response = await getAllConversation(userId, receiverId);
      res
        .status(response.statusCode)
        .json({ message: response.message, data: response.data });
    } catch (error) {
      return res.status(500).json({ message: "Internal server error." });
    }
  }
);

conversationRoutes.get(
  "/getChatPartners",
  async (req: Request, res: Response) => {
    try {
      const { userId } = res.locals.jwtData;
      const response = await getChatPartners(userId);
      res
        .status(response.statusCode)
        .json({ message: response.message, data: response.data });
    } catch (error) {
      return res.status(500).json({ message: "Internal server error." });
    }
  }
);

conversationRoutes.put("/edit-message/:messageId", async (req: Request, res: Response) => {
  
  try {
    const { messageId } = req.params;
    const { newContent } = req.body;
    const { userId } = res.locals.jwtData;

    const validation = editMessageSchema.safeParse({ messageId, newContent });
    if (!validation.success) {
      return res.status(400).json({ message: validation.error });
    }

    const response = await editMessage(messageId, newContent, userId);
    res
    .status(response.statusCode)
    .json({ message: response.message, data: response.data });

  } catch (error) {
    return res.status(500).json({ message: "Internal server error." }); 
  }
});


conversationRoutes.delete("/delete-message/:messageId", async (req: Request, res: Response) => {
  try {
    const { messageId } = req.params;
    const { userId } = res.locals.jwtData;

    const validation = deleteMessageSchema.safeParse({ messageId });
    if (!validation.success) {
      return res.status(400).json({ message: "validatioin fail", errors: validation.error.flatten().fieldErrors });
    }

    const response = await deleteMessage(messageId, userId);
    res
    .status(response.statusCode)
    .json({ message: response.message, data: response.data });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error." });
  }
});

export default conversationRoutes;