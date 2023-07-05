const express = require('express');
const path = require('path');
const { getPlaylist, getAudioFeatures_Track } = require('./utils/helpers');
// require('dotenv').config();
// const apiRoutes = require('./routes/apiRoutes');

// Initialize the app and create a port
const app = express();
const PORT = process.env.PORT || 3001;

// Set up body parsing, static, and route middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
  });

  app.get('/api/playlist/:query', (req, res) => {
    // res.json(getPlaylist('italian'));
    getPlaylist(req.params.query).then(data => res.json(data)).catch((err) => res.status(500).json(err));
    // console.log(res.json(data));
    // res.json(getAudioFeatures_Track('07A0whlnYwfWfLQy4qh3Tq'))
  });

// Start the server on the port
app.listen(PORT, () => console.log(`Listening on PORT: ${PORT}`));
