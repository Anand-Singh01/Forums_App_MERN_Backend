import { Server } from "http";
import { WebSocketServer } from "ws";
import {
  addUser,
  publishOnlineStatus,
  subscribeToReceiveMessages,
} from "../../domain/queries/wsUser";
import WsConnectionHandler from "../../interfaces/handlers/wsConnectionHandler";
import { ITokenData } from "../../util/interfaces";
import { verifyWsToken } from "../../util/token";
export const initializeWsServer = (httpServer: Server) => {
  try {
    const wss = new WebSocketServer({ server: httpServer });
    wss.on("connection", async (ws, req) => {
      try {
        const payload: ITokenData = verifyWsToken(req);
        const { userId } = payload;
        if (payload && userId) {
          // add user to ws store
          addUser(userId, ws);
        }

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
        await subscribeToReceiveMessages(userId);

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
