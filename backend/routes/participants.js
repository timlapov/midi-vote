// Routes de participation aux propositions
// POST /api/proposals/:id/join — rejoindre une proposition
// POST /api/proposals/:id/leave — quitter une proposition

const express = require('express');
const router = express.Router();
const { getDb } = require('../db/database');

// POST /api/proposals/:id/join — Rejoindre une proposition
// Retrait automatique de toute proposition précédente du même jour
router.post('/proposals/:id/join', (req, res) => {
  const db = getDb();
  const proposalId = parseInt(req.params.id);
  const userId = req.headers['x-user-id'];
  const userFirstName = req.headers['x-user-firstname'];
  const userLastName = req.headers['x-user-lastname'] || '';

  if (!userId || !userFirstName) {
    return res.status(400).json({
      error: 'validation_error',
      details: ['En-têtes X-User-Id et X-User-FirstName requis']
    });
  }

  const proposal = db.prepare('SELECT * FROM proposals WHERE id = ?').get(proposalId);
  if (!proposal) {
    return res.status(404).json({ error: 'not_found' });
  }

  // Vérifier que la proposition appartient au jour de vote actif
  if (proposal.vote_day !== req.voteDay) {
    return res.status(409).json({
      error: 'day_switched',
      currentVoteDay: req.voteDay
    });
  }

  // Vérifier si déjà participant à cette proposition
  const alreadyIn = db.prepare(`
    SELECT id FROM participants WHERE proposal_id = ? AND user_id = ?
  `).get(proposalId, userId);

  if (alreadyIn) {
    return res.json({ success: true, leftProposalId: null });
  }

  // Retrait automatique de toute autre proposition du même jour
  const joinTransaction = db.transaction(() => {
    const currentParticipation = db.prepare(`
      SELECT p.proposal_id FROM participants p
      JOIN proposals pr ON p.proposal_id = pr.id
      WHERE p.user_id = ? AND pr.vote_day = ?
    `).get(userId, proposal.vote_day);

    let leftProposalId = null;

    if (currentParticipation) {
      leftProposalId = currentParticipation.proposal_id;
      db.prepare(`
        DELETE FROM participants WHERE proposal_id = ? AND user_id = ?
      `).run(leftProposalId, userId);
    }

    db.prepare(`
      INSERT INTO participants (proposal_id, user_id, first_name, last_name)
      VALUES (?, ?, ?, ?)
    `).run(proposalId, userId, userFirstName, userLastName);

    return leftProposalId;
  });

  const leftProposalId = joinTransaction();
  res.json({ success: true, leftProposalId });
});

// POST /api/proposals/:id/leave — Quitter une proposition
// L'auteur ne peut pas quitter sa propre proposition
router.post('/proposals/:id/leave', (req, res) => {
  const db = getDb();
  const proposalId = parseInt(req.params.id);
  const userId = req.headers['x-user-id'];

  if (!userId) {
    return res.status(400).json({
      error: 'validation_error',
      details: ['En-tête X-User-Id requis']
    });
  }

  const proposal = db.prepare('SELECT * FROM proposals WHERE id = ?').get(proposalId);
  if (!proposal) {
    return res.status(404).json({ error: 'not_found' });
  }

  // Vérifier que la proposition appartient au jour de vote actif
  if (proposal.vote_day !== req.voteDay) {
    return res.status(409).json({
      error: 'day_switched',
      currentVoteDay: req.voteDay
    });
  }

  // L'auteur ne peut pas quitter sa propre proposition
  if (proposal.author_id === userId) {
    return res.status(403).json({ error: 'forbidden', reason: 'author_cannot_leave' });
  }

  // Supprimer la participation
  const result = db.prepare(`
    DELETE FROM participants WHERE proposal_id = ? AND user_id = ?
  `).run(proposalId, userId);

  if (result.changes === 0) {
    return res.status(404).json({ error: 'not_found' });
  }

  res.json({ success: true });
});

module.exports = router;
