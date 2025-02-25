import { WebSocket } from "ws";
import { publishOnlineStatus, removeUser } from "../../domain/queries/wsUser";
import WsStore from "../../domain/wsStore/store";

class WsConnectionHandler {
  private static store = WsStore.getInstance();
  private constructor() {}

  public static async init(ws: WebSocket, userId: string) {
    ws.on("message", (message: string) => {});

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