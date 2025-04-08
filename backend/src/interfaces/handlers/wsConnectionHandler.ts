import { RedisClientType } from "redis";
import { WebSocket } from "ws";
import {
  publishOnlineStatus,
  removeUser,
  sendChatMessageToWsUser,
} from "../../domain/queries/wsUser";
import RedisClient from "../../infrastructure/database/redis/redisClient";
import { IMessageRequest } from "../../util/interfaces";
import { addMessageValidation } from "../middleware/validation/message";

class WsConnectionHandler {
  private static client: RedisClientType;

  private constructor() {}

  public static async init(ws: WebSocket, userId: string) {
    ws.on("message", async (msg: string) => {
      try {
        if (!this.client) {
          this.client = await RedisClient.getProducerClient();
        }
        const message: IMessageRequest = JSON.parse(msg);
        const response = addMessageValidation(message);

        if (!response.status) {
          throw new Error(JSON.stringify(response.data));
        }

        switch (message.type) {
          case "message":
            sendChatMessageToWsUser(message);
            await this.client.lPush("messagingQueue", msg);
        }
      } catch (error) {
        ws.send((error as Error).message || "unexpected error occurred");
      }
    });

    ws.on("close", async (message) => {
      try {
        removeUser(userId);
        await publishOnlineStatus(
          userId,
          JSON.stringify({ type: "status", userId, online: false })
        );
      } catch (error) {
        console.error("error deleting client: ", error);
      }
    });

    ws.on("error", (message) => {
      console.error("error in ws: ", message);
    });
  }
}

export default WsConnectionHandler;
