import express from "express";
import ViteExpress from "vite-express";
import cors from 'cors';
import bodyParse from 'body-parser';
import morgan from 'morgan';

import {config} from 'dotenv';
import { router } from "./src/routes/app.route.js";
import { connectDB } from "./src/database/index.ts";
config();

const startServer = async () => {
  const app = express();
  await connectDB();

  app.use(morgan("dev"));
  app.use(cors({
    origin: "*",
    credentials: true
  }));
  app.use(bodyParse.json());
  
  app.use('/oauth', router)

  const port = Number(process.env.PORT) || 8080;

  ViteExpress.listen(app, port, () =>
    console.log("Running on http://localhost:" + port),
  );
};

startServer();


