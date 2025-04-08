import { Server } from "http";
import { WebSocketServer } from "ws";
import {
  addUser,
  publishOnlineStatus
} from "../../domain/queries/wsUser";
import WsConnectionHandler from "../../interfaces/handlers/wsConnectionHandler";
export const initializeWsServer = (httpServer: Server) => {
  try {
    const wss = new WebSocketServer({ server: httpServer });
    wss.on("connection", async (ws, req) => {
      try {
        const params = new URLSearchParams(req.url?.split("?")[1]);
        const userId = params.get("userId");
        if (!userId) {
          return;
        }
        // add user to ws store
        addUser(userId, ws);

        // publishes online status of user
        await publishOnlineStatus(
          userId,
          JSON.stringify({
            type: "status",
            userId,
            content: { isOnline: true },
          })
        );

        // subscribe to your channel to receive messages from followers.
        //await subscribeToReceiveMessages(userId);

        // add listeners to ws instance
        await WsConnectionHandler.init(ws, userId);
      } catch (error) {
        console.error(error);
        ws.send(JSON.stringify({ error: "server error" }));
        ws.close();
      }
    });

    wss.on("listening", () => {
      console.log("Websocket server listening...");
    });
  } catch (error) {
    console.error(error);
  }
};