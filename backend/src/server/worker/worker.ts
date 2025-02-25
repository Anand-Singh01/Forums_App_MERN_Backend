import { createClient } from "redis";

const subscriber = createClient({ url: "redis://localhost:6379" });
const init = async () => {
  try {
    await subscriber.connect();
    while (true) {
      const task = await subscriber.brPop("messagingQueue", 0);
      if (task) {
        console.log("Processing:", JSON.parse(task.element));
      }
    }
  } catch (error) {
    console.error(error);
  }
};

init();