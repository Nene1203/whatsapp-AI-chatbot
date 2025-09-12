const express = require('express');
const fetch = require('node-fetch');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

// Pour parser le body JSON
app.use(bodyParser.json());

// Route de validation GET pour Meta
app.get('/webhook', (req, res) => {
  const VERIFY_TOKEN = "token123";

  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  if (mode === 'subscribe' && token === VERIFY_TOKEN) {
    console.log("✅ Webhook validé !");
    res.status(200).send(challenge);
  } else {
    console.log("❌ Token incorrect.");
    res.sendStatus(403);
  }
});

// Route de relais POST vers n8n
app.post('/webhook', async (req, res) => {
  try {
    const response = await fetch('https://kirua1907.app.n8n.cloud/webhook-test/whatsapp-inbound', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(req.body),
    });

    const responseData = await response.text();
    console.log("📡 Requête relayée à n8n");

    res.status(200).send('Reçu et relayé');
  } catch (error) {
    console.error('❌ Erreur de relais vers n8n :', error);
    res.status(500).send('Erreur serveur');
  }
});

// Lancer le serveur
app.listen(PORT, () => {
  console.log(`🌐 Serveur en écoute sur le port ${PORT}`);
});
