import express from "express";
import ViteExpress from "vite-express";
import cors from 'cors';
import bodyParse from 'body-parser';

import {config} from 'dotenv';
config();

const startServer = async () => {
  const app = express();

  app.use(cors());
  app.use(bodyParse.json());
  

  const port = Number(process.env.PORT) || 8080;

  ViteExpress.listen(app, port, () =>
    console.log("Running on http://localhost:" + port),
  );
};

startServer();


