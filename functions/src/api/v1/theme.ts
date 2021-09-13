import * as admin from "firebase-admin";
import { Request, Response } from "express";

export const getThemes = async (_: Request, res: Response): Promise<void> => {
  try {
    // お題をすべて取得してデータを返す
    const themes: string[] = [];
    await admin.firestore().collection("themes").get().then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        themes.push(data.body);
      });
    });
    res.status(200).json({ themes: themes });
    return;
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "error" });
    return;
  }
}

export const addTheme = async (req: Request, res: Response): Promise<void> => {
  try {
    const body: string = req.body.body;
    const now = admin.firestore.FieldValue.serverTimestamp();
    await admin.firestore().collection("themes").add({
      body: body,
      createdAt: now,
      updatedAt: now,
    });
    res.status(201).json({ message: "OK" });
    return;
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "error" });
    return;
  }
}
