// Routes des propositions de restaurant
// GET /api/vote-day — jour de vote actif
// GET /api/proposals — propositions du jour avec participants

const express = require('express');
const router = express.Router();
const { getDb } = require('../db/database');

// GET /api/vote-day — Retourne le jour de vote actif
router.get('/vote-day', (req, res) => {
  res.json({
    voteDay: req.voteDay,
    displayLabel: req.voteDayLabel,
    serverTime: new Date().toISOString()
  });
});

// GET /api/proposals — Propositions du jour de vote actif avec participants
router.get('/proposals', (req, res) => {
  const db = getDb();

  const proposals = db.prepare(`
    SELECT * FROM proposals
    WHERE vote_day = ?
    ORDER BY departure_time ASC
  `).all(req.voteDay);

  const result = proposals.map(p => {
    const participants = db.prepare(`
      SELECT user_id, first_name, last_name
      FROM participants
      WHERE proposal_id = ?
      ORDER BY joined_at ASC
    `).all(p.id);

    return {
      id: p.id,
      restaurantName: p.restaurant_name,
      cuisineType: p.cuisine_type,
      googleMapsLink: p.google_maps_link,
      menuLink: p.menu_link,
      departureTime: p.departure_time,
      mealFormat: p.meal_format,
      comment: p.comment,
      authorId: p.author_id,
      authorFirstName: p.author_first_name,
      authorLastName: p.author_last_name,
      createdAt: p.created_at,
      participants: participants.map(pt => ({
        userId: pt.user_id,
        firstName: pt.first_name,
        lastName: pt.last_name
      })),
      participantCount: participants.length
    };
  });

  res.json({
    voteDay: req.voteDay,
    displayLabel: req.voteDayLabel,
    proposals: result
  });
});

// POST /api/proposals — Créer une proposition et ajouter l'auteur comme premier participant
router.post('/proposals', (req, res) => {
  const db = getDb();
  const userId = req.headers['x-user-id'];
  const userFirstName = req.headers['x-user-firstname'];
  const userLastName = req.headers['x-user-lastname'] || '';

  // Validation des headers
  if (!userId || !userFirstName) {
    return res.status(400).json({
      error: 'validation_error',
      details: ['En-têtes X-User-Id et X-User-FirstName requis']
    });
  }

  const { restaurantName, cuisineType, googleMapsLink, menuLink, departureTime, mealFormat, comment } = req.body;

  // Validation des champs obligatoires
  const errors = [];
  if (!restaurantName?.trim()) errors.push('restaurantName est obligatoire');
  if (!cuisineType?.trim()) errors.push('cuisineType est obligatoire');
  if (!googleMapsLink?.trim()) errors.push('googleMapsLink est obligatoire');
  if (!departureTime) errors.push('departureTime est obligatoire');
  if (!mealFormat) errors.push('mealFormat est obligatoire');

  // Validation de l'heure de départ (entre 12:00 et 14:00)
  if (departureTime && !/^(1[2-3]):[0-5][0-9]$/.test(departureTime) && departureTime !== '14:00') {
    errors.push('departureTime doit être entre 12:00 et 14:00');
  }

  // Validation du format de repas
  if (mealFormat && !['sur_place', 'a_emporter'].includes(mealFormat)) {
    errors.push('mealFormat doit être sur_place ou a_emporter');
  }

  if (errors.length > 0) {
    return res.status(400).json({ error: 'validation_error', details: errors });
  }

  // Insertion de la proposition
  const insertProposal = db.prepare(`
    INSERT INTO proposals (vote_day, restaurant_name, cuisine_type, google_maps_link, menu_link, departure_time, meal_format, comment, author_id, author_first_name, author_last_name)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const insertParticipant = db.prepare(`
    INSERT INTO participants (proposal_id, user_id, first_name, last_name)
    VALUES (?, ?, ?, ?)
  `);

  const createProposal = db.transaction(() => {
    const result = insertProposal.run(
      req.voteDay, restaurantName.trim(), cuisineType.trim(), googleMapsLink.trim(),
      menuLink?.trim() || null, departureTime, mealFormat, comment?.trim() || null,
      userId, userFirstName, userLastName
    );
    const proposalId = result.lastInsertRowid;

    // Ajouter l'auteur comme premier participant
    insertParticipant.run(proposalId, userId, userFirstName, userLastName);

    return proposalId;
  });

  const proposalId = createProposal();

  // Retourner la proposition créée avec ses participants
  const proposal = db.prepare('SELECT * FROM proposals WHERE id = ?').get(proposalId);
  const participants = db.prepare(`
    SELECT user_id, first_name, last_name FROM participants WHERE proposal_id = ? ORDER BY joined_at ASC
  `).all(proposalId);

  res.status(201).json({
    id: proposal.id,
    restaurantName: proposal.restaurant_name,
    cuisineType: proposal.cuisine_type,
    googleMapsLink: proposal.google_maps_link,
    menuLink: proposal.menu_link,
    departureTime: proposal.departure_time,
    mealFormat: proposal.meal_format,
    comment: proposal.comment,
    authorId: proposal.author_id,
    authorFirstName: proposal.author_first_name,
    authorLastName: proposal.author_last_name,
    createdAt: proposal.created_at,
    participants: participants.map(pt => ({
      userId: pt.user_id,
      firstName: pt.first_name,
      lastName: pt.last_name
    })),
    participantCount: participants.length
  });
});

// DELETE /api/proposals/:id — Supprimer une proposition (auteur uniquement, sans autres participants)
router.delete('/proposals/:id', (req, res) => {
  const db = getDb();
  const proposalId = req.params.id;
  const userId = req.headers['x-user-id'];

  const proposal = db.prepare('SELECT * FROM proposals WHERE id = ?').get(proposalId);
  if (!proposal) {
    return res.status(404).json({ error: 'not_found' });
  }

  // Vérifier que l'utilisateur est l'auteur
  if (proposal.author_id !== userId) {
    return res.status(403).json({ error: 'forbidden', reason: 'not_author' });
  }

  // Vérifier qu'il n'y a pas d'autres participants (hors auteur)
  const otherParticipants = db.prepare(`
    SELECT COUNT(*) as count FROM participants
    WHERE proposal_id = ? AND user_id != ?
  `).get(proposalId, userId);

  if (otherParticipants.count > 0) {
    return res.status(403).json({ error: 'forbidden', reason: 'has_other_participants' });
  }

  db.prepare('DELETE FROM proposals WHERE id = ?').run(proposalId);
  res.json({ success: true });
});

module.exports = router;
