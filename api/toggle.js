import admin from "firebase-admin";

let app;
if (!admin.apps.length) {
  const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
  app = admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
} else {
  app = admin.app();
}

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { enabled } = req.body;

    try {
      const db = admin.firestore();
      const docRef = db.doc("options/option1");
      await docRef.set({ blackscreen: enabled }, { merge: true });
      return res.status(200).json({ success: true });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: err.message });
    }
  } else {
    return res.status(405).json({ error: "Method not allowed" });
  }
}
