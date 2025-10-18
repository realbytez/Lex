import admin from "firebase-admin";

let app;
try {
  if (!admin.apps.length) {
    const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
    app = admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
    console.log("✅ Firebase initialized successfully");
  } else {
    app = admin.app();
  }
} catch (err) {
  console.error("❌ Firebase initialization error:", err);
}

export default async function handler(req, res) {
  console.log("Request method:", req.method);
  console.log("Request body:", req.body);

  if (req.method === "POST") {
    try {
      const { enabled } = req.body;
      console.log("Received enabled:", enabled);

      if (typeof enabled !== "boolean") {
        return res.status(400).json({ error: "enabled must be boolean" });
      }

      const db = admin.firestore();
      const docRef = db.doc("options/option1");
      await docRef.set({ blackscreen: enabled }, { merge: true });

      return res.status(200).json({ success: true, blackscreen: enabled });
    } catch (err) {
      console.error("❌ Firestore error:", err);
      return res.status(500).json({ error: err.message });
    }
  } else {
    return res.status(405).json({ error: "Method not allowed" });
  }
}
