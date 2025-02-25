import { WebSocket } from "ws";
import RedisClient from "../../infrastructure/database/redis/redisClient";
import { IMessageRequest } from "../../util/interfaces";
import {
  getContactMessagesKey,
  getContactStatusKey,
} from "../../util/redisKeys";
import WsStore from "../wsStore/store";

const store = WsStore.getInstance();
const sockets = store.sockets;
export const addUser = (userId: string, ws: WebSocket) => {
  if (!sockets.has(userId)) {
    sockets.set(userId, ws);
  }
};

export const removeUser = (userId: string) => {
  if (sockets.has(userId)) {
    sockets.delete(userId);
  }
};

export const getSocket = (userId: string) => {
  return sockets.get(userId);
};

export const getOnlineStatus = (userId: string) => {
  if (sockets.has(userId)) {
    return true;
  } else {
    return false;
  }
};

export const publishOnlineStatus = async (userId: string, message: string) => {
  const key = getContactStatusKey(userId);
  (await RedisClient.getPublisherClient()).publish(key, message);
};

export const subscribeToReceiveMessages = async (userId: string) => {
  const ws = sockets.get(userId);
  if (ws) {
    const key = getContactMessagesKey(userId);
    (await RedisClient.getSubscriberClient()).subscribe(key, (message) => {
      const msg = JSON.parse(message);
      ws.send(JSON.stringify(msg));
    });
  }
};

export const publishMessage = async (
  msg: IMessageRequest
) => {
  const { message, receiverId, senderId } = msg;
  const ws = sockets.get(receiverId);
  if (ws) {
    const key = getContactMessagesKey(receiverId);
    const content = JSON.stringify({ senderId, message });
    (await RedisClient.getPublisherClient()).publish(key, content);
  }
};
