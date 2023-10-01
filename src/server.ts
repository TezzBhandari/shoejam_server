import express, { Application } from "express";
import dotenv from "dotenv";
// import cors from "cors";

import routes from "./routes";

import { errorHandler } from "./middlewares/errorHandler";
import db from "./db/client";

dotenv.config();

const PORT = process.env.PORT || 3001;

const app: Application = express();

// setting up all the middleware
// app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/v1", routes);

// error handling middleware
app.use("*", errorHandler);

// server initialization
const start = async () => {
  try {
    // console.log("Server Initializing...");
    console.log("Database Connection Established");
    console.log(db.$with);
    app.listen(PORT, () => console.log(`Server Listening on Port ${PORT}...`));
  } catch (error: any) {
    console.error("Failed To Start The Server");
    console.error(error);
    process.exit(1);
  }
};

start();
