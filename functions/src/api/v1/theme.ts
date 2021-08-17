import * as admin from "firebase-admin";
import { Request, Response } from "express";

export const getThemes = async (_: Request, res: Response): Promise<void> => {
  try {
    // 利用者数をカウントする
    await admin.firestore().runTransaction(async (transaction) => {
      const ref = admin.firestore().collection("logs").doc("userCount");
      const doc = await transaction.get(ref);

      if (!doc.exists) {
        throw new Error("Document does not exist");
      }

      const data = doc.data();
      if (data === undefined) {
        throw new Error("data is undefined");
      }

      const newCount: number = data.count + 1;
      transaction.update(ref, {
        count: newCount,
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });
    });

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
