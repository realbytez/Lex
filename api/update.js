export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Only POST allowed" });

  const { action, value, playerName } = req.body;
  const projectId = "testprojfr";
  const apiKey = "AIzaSyCu9kLqzd-Xfm23GhY4kUuPRyi1kiztjTg";

  // Helper to update a Firestore document
  async function updateFirestore(docPath, fields) {
    const url = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/${docPath}?key=${apiKey}`;
    await fetch(url, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fields })
    });
  }

  try {
    if (action === "blackscreen") {
      await updateFirestore("options/option1", { blackscreen: { booleanValue: value } });
      return res.status(200).json({ success: true });
    }

    if (action === "player") {
      const url = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/options/playersOnline?key=${apiKey}`;
      const resFetch = await fetch(url);
      const data = await resFetch.json();
      const players = data.fields?.playersOnline?.mapValue?.fields || {};

      if (value) players[playerName] = { booleanValue: true };
      else delete players[playerName];

      await updateFirestore("options/playersOnline", { playersOnline: { mapValue: { fields: players } } });
      return res.status(200).json({ success: true });
    }

    res.status(400).json({ error: "Invalid action" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
