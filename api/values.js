export default async function handler(req, res) {
  const projectId = "testprojfr";
  const apiKey = "AIzaSyCu9kLqzd-Xfm23GhY4kUuPRyi1kiztjTg";

  // Read blackscreen
  const blackscreenUrl = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/options/option1?key=${apiKey}`;
  // Read players
  const playersUrl = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/options/playersOnline?key=${apiKey}`;

  try {
    const [bsRes, plRes] = await Promise.all([fetch(blackscreenUrl), fetch(playersUrl)]);
    const bsData = await bsRes.json();
    const plData = await plRes.json();

    const blackscreen = bsData.fields?.blackscreen?.booleanValue || false;

    const playersOnline = {};
    if (plData.fields?.playersOnline?.mapValue?.fields) {
      for (const [player, val] of Object.entries(plData.fields.playersOnline.mapValue.fields)) {
        if (val.booleanValue) playersOnline[player] = true;
      }
    }

    res.status(200).json({ blackscreen, playersOnline });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
