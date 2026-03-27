// Point d'entrée du serveur MidiVote
// Express + CORS + routes API

const express = require('express');
const cors = require('cors');
const { getDb } = require('./db/database');
const { injectVoteDay } = require('./middleware/vote-day');
const proposalsRouter = require('./routes/proposals');
const participantsRouter = require('./routes/participants');

const app = express();
const PORT = 3000;

// Initialiser la base de données au démarrage
getDb();

// Middleware globaux
app.use(cors({ origin: 'http://localhost:4200' }));
app.use(express.json());
app.use(injectVoteDay);

// Routes API
app.use('/api', proposalsRouter);
app.use('/api', participantsRouter);

// Démarrage du serveur
app.listen(PORT, () => {
  console.log(`Serveur MidiVote démarré sur http://localhost:${PORT}`);
});
