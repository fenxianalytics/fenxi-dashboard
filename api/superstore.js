export default async function handler(req, res) {
  try {
    const SUPABASE_URL = "https://rlivkvcykrcpwskuumot.supabase.co";
    const SUPABASE_SECRET_KEY = process.env.SUPABASE_SECRET_KEY;

    const response = await fetch(
      `${SUPABASE_URL}/rest/v1/Superstore?select=*`,
      {
        headers: {
          apikey: SUPABASE_SECRET_KEY,
          Authorization: `Bearer ${SUPABASE_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Supabase error: ${response.status} - ${text}`);
    }

    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}