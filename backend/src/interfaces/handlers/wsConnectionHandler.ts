import { RedisClientType } from "redis";
import { WebSocket } from "ws";
import {
  publishMessage,
  publishOnlineStatus,
  removeUser,
} from "../../domain/queries/wsUser";
import RedisClient from "../../infrastructure/database/redis/redisClient";
import { IMessageRequest } from "../../util/interfaces";

class WsConnectionHandler {
  private static client: RedisClientType;

  private constructor() {}

  public static async init(ws: WebSocket, userId: string) {
    ws.on("message", async (msg: string) => {
      if (!this.client) {
        this.client = await RedisClient.getProducerClient();
      }
      const message: IMessageRequest = JSON.parse(msg);
      await publishMessage(message);
      await this.client.lPush("messagingQueue", msg);
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