// server.js
require('dotenv').config();
const express = require('express');
const fetch = require('node-fetch');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const TMDB_BEARER = process.env.TMDB_BEARER;

if (!TMDB_BEARER) {
  console.error("Missing TMDB_BEARER in .env");
  process.exit(1);
}

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// search endpoint
app.get('/api/search', async (req, res) => {
  const q = req.query.q;
  try {
    const resp = await fetch(`https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(q)}`, {
      headers: { Authorization: `Bearer ${TMDB_BEARER}` }
    });
    const data = await resp.json();
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'TMDB search failed' });
  }
});

// popular endpoint
app.get('/api/popular', async (req, res) => {
  try {
    const resp = await fetch(`https://api.themoviedb.org/3/movie/popular?language=en-US&page=1`, {
      headers: { Authorization: `Bearer ${TMDB_BEARER}` }
    });
    const data = await resp.json();
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'TMDB popular failed' });
  }
});

app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
