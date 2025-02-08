import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import { connectToDatabase } from "../infrastructure/database/mongo/connection";
import dependencies from "../infrastructure/dependencies";
import postRoutes from "../interfaces/routes/postRoutes";

const PORT = 3000;
const app = express();
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

app.use("/api/post", postRoutes);

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
