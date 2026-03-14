export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');

  const sheetId = process.env.GOOGLE_SHEET_ID;
  const apiKey  = process.env.GOOGLE_API_KEY;

  const range = encodeURIComponent('Sample - Superstore.csv');
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${range}?key=${apiKey}`;

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Sheets API error: ${response.status}`);
    const json = await response.json();

    const [headers, ...rows] = json.values;
    const data = rows.map(row =>
      Object.fromEntries(headers.map((h, i) => [h, row[i] ?? '']))
    );

    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}