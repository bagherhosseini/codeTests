// index.js
require('dotenv').config();
var express = require('express');
var app = express();

// Enable CORS
var cors = require('cors');
app.use(cors({ optionsSuccessStatus: 200 }));

// Add these two lines to parse POST request body
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Serve static files from 'public' directory
app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

const urlDatabase = new Map();
let counter = 1;

app.post('/api/shorturl', async function(req, res) {
  const originalUrl = req.body.url;
  console.log('Received URL:', originalUrl);

  try {
    const url = new URL(originalUrl);
    if (!['http:', 'https:'].includes(url.protocol)) {
      throw new Error('Invalid protocol');
    }

    const shortUrl = counter++;
    urlDatabase.set(shortUrl.toString(), originalUrl);

    res.json({
      original_url: originalUrl,
      short_url: shortUrl
    });

  } catch (error) {
    res.json({ error: 'invalid url' });
  }
});

app.get('/api/shorturl/:short_url', function(req, res) {
  const originalUrl = urlDatabase.get(req.params.short_url);
  if (originalUrl) {
    res.redirect(originalUrl);
  } else {
    res.json({ error: 'No short URL found for the given input' });
  }
});

var listener = app.listen(process.env.PORT || 3000, function() {
  console.log('Your app is listening on port ' + listener.address().port);
});