// Middleware de calcul du jour de vote actif et validation HTTP 409
// Injecte req.voteDay et req.voteDayLabel dans chaque requête
// Pour les mutations (POST/DELETE), vérifie la cohérence avec le jour actif

const { getCurrentVoteDay, getDisplayLabel } = require('../utils/date-helpers');
const { getDb } = require('../db/database');

// Middleware qui injecte le jour de vote dans la requête
function injectVoteDay(req, res, next) {
  req.voteDay = getCurrentVoteDay();
  req.voteDayLabel = getDisplayLabel(req.voteDay);
  next();
}

// Middleware de validation 409 pour les mutations
// Vérifie que la proposition cible appartient au jour de vote actif
function validateVoteDay(req, res, next) {
  const proposalId = req.params.id;
  if (!proposalId) {
    return next();
  }

  const db = getDb();
  const proposal = db.prepare('SELECT vote_day FROM proposals WHERE id = ?').get(proposalId);

  if (!proposal) {
    return res.status(404).json({ error: 'not_found' });
  }

  if (proposal.vote_day !== req.voteDay) {
    return res.status(409).json({
      error: 'day_switched',
      currentVoteDay: req.voteDay
    });
  }

  next();
}

module.exports = { injectVoteDay, validateVoteDay };
