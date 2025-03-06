import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import { createServer } from "http";
import { connectToDatabase } from "../../infrastructure/database/mongo/connection";
import dependencies from "../../infrastructure/dependencies";
import authRoutes from "../../interfaces/routes/authRoutes";
import commentRoutes from "../../interfaces/routes/commentRoutes";
import followRoutes from "../../interfaces/routes/followRoutes";
import likePostRoutes from "../../interfaces/routes/likePostRoutes";
import conversationRoutes from "../../interfaces/routes/messageRoutes";
import postRoutes from "../../interfaces/routes/postRoutes";
import feedbackRoutes from "../../interfaces/routes/feedbackRoutes";
import profileRoutes from "../../interfaces/routes/profileRoutes";
import savePostRoutes from "../../interfaces/routes/savePostRoutes";
import { verifyToken } from "../../util/token";
import { startWorker1 } from "../worker/worker";
import { initializeWsServer } from "../ws/wsServer";

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser(dependencies.config.cookie.cookieSecret));

app.use(
  cors({
    origin: [dependencies.config.client.url!],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization", "auth-token"],
    methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE", "OPTIONS"],
  })
);
app.use("/api/auth", authRoutes);
app.use(verifyToken);
app.use("/api/post", postRoutes);
app.use("/api/comment", commentRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/follow", followRoutes);
app.use("/api/save", savePostRoutes);
app.use("/api/like", likePostRoutes);
app.use("/api/feedback", feedbackRoutes); 

app.use("/api/conversation", conversationRoutes);

const httpServer = createServer(app);

const startServer = async () => {
  try {
    await connectToDatabase();
    console.log("Connected to database.");

    httpServer.listen(PORT, async () => {
      console.log(`Http server listening on http://localhost:${PORT}`);
    });

    initializeWsServer(httpServer);
    await startWorker1();
  } catch (error) {
    console.error(error);
  }
};

startServer();