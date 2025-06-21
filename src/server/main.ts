import express from "express";
import ViteExpress from "vite-express";
import cors from 'cors';
import bodyParse from 'body-parser';
import morgan from 'morgan';

import { router as mainRouter } from "./src/routes/app.route.ts";
import { router as authRouter } from "./src/routes/auth.route.ts";
import { router as adminRouter } from "./src/routes/admin.route.ts";
import { connectDB } from "./src/database/index.ts";
import {config} from 'dotenv';
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
  app.use(bodyParse.urlencoded());
  
  app.use('/api', mainRouter);
  app.use('/auth', authRouter);
  app.use('/admin', adminRouter);

  const port = Number(process.env.PORT) || 8080;

  ViteExpress.listen(app, port, () =>
    console.log("Running on http://localhost:" + port),
  );
};

startServer();


