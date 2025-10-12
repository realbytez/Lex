export default async function handler(req, res) {
  const projectId = "testprojfr";
  const apiKey = "AIzaSyCu9kLqzd-Xfm23GhY4kUuPRyi1kiztjTg";
  const docPath = "options/option1";

  const url = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/${docPath}?key=${apiKey}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      return res.status(response.status).json({ error: "Failed to fetch data" });
    }

    const data = await response.json();
    res.status(200).json(data.fields); // raw Firestore fields
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
