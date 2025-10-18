import admin from "firebase-admin";

// Initialize Firebase Admin if not already
let app;
if (!admin.apps.length) {
  try {
    const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
    app = admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
    console.log("Firebase initialized successfully");
  } catch (err) {
    console.error("Failed to initialize Firebase:", err);
  }
} else {
  app = admin.app();
}

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { enabled } = req.body;

    if (typeof enabled !== "boolean") {
      return res.status(400).json({ error: "Invalid 'enabled' value, must be boolean" });
    }

    try {
      const db = admin.firestore();
      const docRef = db.doc("options/option1");
      await docRef.set({ blackscreen: enabled }, { merge: true });
      return res.status(200).json({ success: true, blackscreen: enabled });
    } catch (err) {
      console.error("Firestore error:", err);
      return res.status(500).json({ error: err.message });
    }
  } else {
    return res.status(405).json({ error: "Method not allowed" });
  }
}
