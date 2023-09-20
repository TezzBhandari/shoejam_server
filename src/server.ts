import express, { Application } from "express";
import dotenv from "dotenv";
// import cors from "cors";

import routes from "./routes";
// import prisma from "./db/prisma_client";

import { errorHandler } from "./middlewares/errorHandler";

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

const start = async () => {
  try {
    console.log("Server Initializing...");
    // await prisma.$connect();
    console.log("Database Connection Established");
    app.listen(PORT, () => console.log(`Server Listening on Port ${PORT}...`));
  } catch (error: any) {
    console.debug("Server.ts", "Failed to Connect to the Database");
    console.log(error);
    process.exit(1);
  }
};

start();
