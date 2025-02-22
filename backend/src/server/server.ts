import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import { connectToDatabase } from "../infrastructure/database/mongo/connection";
import dependencies from "../infrastructure/dependencies";
import authRoutes from "../interfaces/routes/authRoutes";
import postRoutes from "../interfaces/routes/postRoutes";
import preferenceRoutes from "../interfaces/routes/preferenceRoutes";
import { verifyToken } from "../util/token";
import { savePost } from "../infrastructure/respositories/postRepository";
import savePostRoutes from "../interfaces/routes/savePostRoutes";
import likePostRoutes from "../interfaces/routes/likePostRoutes";

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
app.use("/api/preference", preferenceRoutes); 
app.use("/api/save", savePostRoutes);
app.use("/api/like", likePostRoutes);

app.listen(PORT, async () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  connectToDatabase()
    .then(() => {
      console.log("connected to database 🤝");
    })
    .catch((error) => {
      console.log(error);
    });
});