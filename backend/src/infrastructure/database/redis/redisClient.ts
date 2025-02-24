import { createClient, RedisClientType } from "redis";

class RedisClient {
  private static publisherClient: RedisClientType;
  private static subscriberClient: RedisClientType;

  private constructor() {}

  public static getPublisherClient = async () => {
    if (!this.publisherClient) {
      await this.createPublisherClient();
    }
    return this.publisherClient;
  };

  public static getSubscriberClient = async () => {
    if (!this.subscriberClient) {
      await this.createSubscriberClient();
    }
    return this.subscriberClient;
  };

  private static createPublisherClient = async () => {
    this.publisherClient = createClient({
      url: "redis://localhost:6379",
    });
    this.publisherClient.on("connect", () => {
      console.log("Connected to redis.");
    });
    this.publisherClient.on("error", (err) => {
      console.error("Redis connection error", err);
    });
    this.publisherClient.connect().catch((err) => {
      console.error("Failed to connect to redis: ", err);
    });
  };

  private static createSubscriberClient = async () => {
    this.subscriberClient = createClient({
      url: "redis://localhost:6379",
    });
    this.subscriberClient.on("connect", () => {
      console.log("Connected to redis.");
    });
    this.subscriberClient.on("error", (err) => {
      console.error("Redis connection error", err);
    });
    this.subscriberClient.connect().catch((err) => {
      console.error("Failed to connect to redis: ", err);
    });
  };
}

export default RedisClient;
