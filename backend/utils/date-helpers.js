// Fonctions utilitaires pour le calcul du jour de vote
// Règles : avant 14h00 = aujourd'hui, après 14h00 = prochain jour ouvré
// Le week-end est sauté (vendredi 14h00 → lundi)

const CUTOFF_HOUR = 14;

// Jours de la semaine en français pour l'affichage
const JOURS_FR = [
  'DIMANCHE', 'LUNDI', 'MARDI', 'MERCREDI',
  'JEUDI', 'VENDREDI', 'SAMEDI'
];

const MOIS_FR = [
  'JANVIER', 'FÉVRIER', 'MARS', 'AVRIL', 'MAI', 'JUIN',
  'JUILLET', 'AOÛT', 'SEPTEMBRE', 'OCTOBRE', 'NOVEMBRE', 'DÉCEMBRE'
];

// Retourne le prochain jour ouvré à partir d'une date
function nextBusinessDay(date) {
  const next = new Date(date);
  next.setDate(next.getDate() + 1);

  // Sauter le week-end
  const day = next.getDay();
  if (day === 6) next.setDate(next.getDate() + 2); // Samedi → Lundi
  if (day === 0) next.setDate(next.getDate() + 1); // Dimanche → Lundi

  return next;
}

// Calcule le jour de vote actif
function getCurrentVoteDay(now = new Date()) {
  const hour = now.getHours();

  if (hour < CUTOFF_HOUR) {
    // Avant 14h00 : le jour de vote est aujourd'hui
    // Sauf si aujourd'hui est un week-end
    const day = now.getDay();
    if (day === 0 || day === 6) {
      // Week-end : le jour de vote est lundi
      const monday = new Date(now);
      if (day === 0) monday.setDate(monday.getDate() + 1);
      if (day === 6) monday.setDate(monday.getDate() + 2);
      return formatDate(monday);
    }
    return formatDate(now);
  } else {
    // Après 14h00 : le jour de vote est le prochain jour ouvré
    return formatDate(nextBusinessDay(now));
  }
}

// Formate une date en YYYY-MM-DD
function formatDate(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

// Génère le label d'affichage : "JEUDI 27 MARS"
function getDisplayLabel(voteDayStr) {
  const parts = voteDayStr.split('-');
  const date = new Date(
    parseInt(parts[0]),
    parseInt(parts[1]) - 1,
    parseInt(parts[2])
  );
  const jour = JOURS_FR[date.getDay()];
  const mois = MOIS_FR[date.getMonth()];
  const numero = date.getDate();
  return `${jour} ${numero} ${mois}`;
}

module.exports = {
  getCurrentVoteDay,
  getDisplayLabel,
  formatDate,
  nextBusinessDay,
  CUTOFF_HOUR
};
