import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import path from "path"; // to allow access to static files
import { fileURLToPath } from "url"; // Required to handle import.meta.url

import userRoutes from "./Routes/userRoutes.js";
import postRoutes from "./Routes/postRoutes.js";
import likeRoutes from "./Routes/likeRoutes.js";
import commentRoutes from "./Routes/commentRoutes.js";
import errorHandler from "./Middlewares/errorHandler.js";
import notFound from "./Middlewares/notFound.js";

dotenv.config({ path: "./config.env" });
const app = express();

// Convert import.meta.url to a file path
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 7800;

let MONGO_URI = "";
if (process.env.NODE_ENV === "production") {
  MONGO_URI = process.env.HOSTED_CONN;
} else {
  MONGO_URI = process.env.LOCAL_CONN;
}

app.use(cors());
app.use(express.json());
app.use(express.static("./uploads"));

app.use("/api/v1/user", userRoutes);
app.use("/api/v1/post", postRoutes);
app.use("/api/v1/likes", likeRoutes);
app.use("/api/v1/comment", commentRoutes);

// app.use('/uploads', express.static(path.join(import.meta.url, 'uploads')));

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// app.use('/', (req, res) => {
//   res.send('This is the default response');
// });


app.use(express.static(path.join(__dirname, "build"))); // open build for access
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

// Use notFound middleware
app.use(notFound);

// Use errorHandler middleware
app.use(errorHandler);

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error(err);
  });
