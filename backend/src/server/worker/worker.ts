import { RedisClientType } from "redis";
import { addMessageQuery } from "../../domain/queries/conversation";
import RedisClient from "../../infrastructure/database/redis/redisClient";
import { IMessageRequest } from "../../util/interfaces";

let consumerClient: RedisClientType;
export const startWorker1 = async () => {
  try {
    if (!consumerClient) {
      consumerClient = await RedisClient.getConsumerClient();
    }
    while (true) {
      const task = await consumerClient.brPop("messagingQueue", 0);
      if (task) {
        const message: IMessageRequest = JSON.parse(task.element);
        await addMessageQuery(message);
      }
    }
  } catch (error) {
    console.error(error);
  }
};
