// server.js
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

// Middleware pour parser le JSON
app.use(express.json());

// Vérification du webhook (GET)
app.get('/webhook', (req, res) => {
  const VERIFY_TOKEN = 'token123'; // même token que sur Meta

  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  if (mode && token === VERIFY_TOKEN) {
    res.status(200).send(challenge);
  } else {
    res.sendStatus(403);
  }
});

// Réception des messages (POST)
app.post('/webhook', (req, res) => {
  console.log('Received webhook:', JSON.stringify(req.body, null, 2));
  res.sendStatus(200);
});

// Lancer le serveur
app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
