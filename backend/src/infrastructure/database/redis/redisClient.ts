import { createClient, RedisClientType } from "redis";

class RedisClient {
  private static publisherClient: RedisClientType;
  private static subscriberClient: RedisClientType;
  private static producerClient: RedisClientType;
  private static consumerClient: RedisClientType;
  private static keyValueClient: RedisClientType;

  private constructor() {}

  public static async getPublisherClient() {
    if (!this.publisherClient) {
      await this.createPublisherClient();
    }
    return this.publisherClient;
  }

  public static async getSubscriberClient() {
    if (!this.subscriberClient) {
      await this.createSubscriberClient();
    }
    return this.subscriberClient;
  }

  public static async getProducerClient() {
    if (!this.producerClient) {
      await this.createProducerClient();
    }
    return this.producerClient;
  }

  public static async getConsumerClient() {
    if (!this.consumerClient) {
      await this.createConsumerClient();
    }
    return this.consumerClient;
  }

  public static async getKeyValueClient() {
    if (!this.keyValueClient) {
      await this.createKeyValueClient();
    }
    return this.keyValueClient;
  }

  private static async createPublisherClient() {
    this.publisherClient = createClient({ url: "redis://localhost:6379" });
    this.setupEventHandlers(this.publisherClient, "PublisherClient");
    await this.publisherClient.connect();
  }

  private static async createSubscriberClient() {
    this.subscriberClient = createClient({ url: "redis://localhost:6379" });
    this.setupEventHandlers(this.subscriberClient, "SubscriberClient");
    await this.subscriberClient.connect();
  }

  private static async createProducerClient() {
    this.producerClient = createClient({ url: "redis://localhost:6379" });
    this.setupEventHandlers(this.producerClient, "ProducerClient");
    await this.producerClient.connect();
  }

  private static async createConsumerClient() {
    this.consumerClient = createClient({ url: "redis://localhost:6379" });
    this.setupEventHandlers(this.consumerClient, "ConsumerClient");
    await this.consumerClient.connect();
  }

  private static async createKeyValueClient() {
    this.keyValueClient = createClient({ url: "redis://localhost:6379" });
    this.setupEventHandlers(this.keyValueClient, "KeyValueClient");
    await this.keyValueClient.connect();
  }

  private static setupEventHandlers(
    client: RedisClientType,
    clientName: string
  ) {
    client.on("connect", () =>
      console.log(`${clientName} Connected to Redis.`)
    );
    client.on("error", (err) =>
      console.error(`${clientName} Connection Error:`, err)
    );
  }
}

export default RedisClient;