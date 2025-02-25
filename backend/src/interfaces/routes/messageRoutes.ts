import { Request, Response, Router } from "express";
import {
  getAllConversation,
  getChatPartners,
} from "../../infrastructure/repositories/messageRepostiory";
import { getAllMessagesValidation } from "../middleware/validation/message";

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

export default conversationRoutes;