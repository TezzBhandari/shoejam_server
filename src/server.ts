import express, { Application } from "express";
import dotenv from "dotenv";
import morgan from "morgan";
// import cors from "cors";

import routes from "./routes";

import { errorHandler } from "./middlewares/errorHandler";
import db from "./db/client";
import { Category } from "./db/schema";

dotenv.config();

const PORT = process.env.PORT || 3001;

const app: Application = express();

// setting up all the middleware
// app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/v1", routes);

// error handling middleware
app.use("*", errorHandler);

// server initialization
const start = async () => {
  try {
    // console.log("Server Initializing...");
    console.log(await db.select().from(Category));
    console.log("Database Connection Established");
    app.listen(PORT, () => console.log(`Server Listening on Port ${PORT}...`));
  } catch (error: any) {
    console.error("Failed To Start The Server");
    console.error(error?.message);
    process.exit(1);
  }
};

start();
