import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import express from "express";
import cors from "cors";
import { getThemes, addTheme } from "./api/v1/theme";

admin.initializeApp();

const app = express();

app.use(cors({ origin: true }));
app.use(express.json());
app.get("/api/v1/themes", getThemes);
app.post("/api/v1/themes", addTheme);

app.use((_, res, next) => {
  res.status(404).send("Not Found");
  next();
});

exports.app = functions.region("asia-northeast1").https.onRequest(app);
