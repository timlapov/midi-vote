# Modèle de données : MidiVote

**Branche** : `001-midivote-app` | **Date** : 2026-03-26

## Schéma SQLite

### Table `proposals` (Propositions)

| Colonne | Type | Contraintes | Description |
|---------|------|-------------|-------------|
| id | INTEGER | PRIMARY KEY AUTOINCREMENT | Identifiant unique |
| vote_day | TEXT | NOT NULL | Date du jour de vote (format YYYY-MM-DD) |
| restaurant_name | TEXT | NOT NULL | Nom du restaurant |
| cuisine_type | TEXT | NOT NULL | Type de cuisine (japonais, italien, etc.) |
| google_maps_link | TEXT | NOT NULL | Lien Google Maps |
| menu_link | TEXT | | Lien vers le menu (optionnel) |
| departure_time | TEXT | NOT NULL | Heure de départ (format HH:MM, entre 12:00 et 14:00) |
| meal_format | TEXT | NOT NULL, CHECK(meal_format IN ('sur_place', 'a_emporter')) | Format du repas |
| comment | TEXT | | Commentaire libre (optionnel) |
| author_id | TEXT | NOT NULL | UUID de l'auteur (depuis localStorage client) |
| author_first_name | TEXT | NOT NULL | Prénom de l'auteur |
| author_last_name | TEXT | | Nom de l'auteur |
| created_at | TEXT | NOT NULL DEFAULT (datetime('now')) | Date de création |

**Index** : `CREATE INDEX idx_proposals_vote_day ON proposals(vote_day);`

### Table `participants` (Participations)

| Colonne | Type | Contraintes | Description |
|---------|------|-------------|-------------|
| id | INTEGER | PRIMARY KEY AUTOINCREMENT | Identifiant unique |
| proposal_id | INTEGER | NOT NULL, FOREIGN KEY → proposals(id) ON DELETE CASCADE | Proposition rejointe |
| user_id | TEXT | NOT NULL | UUID de l'utilisateur (depuis localStorage client) |
| first_name | TEXT | NOT NULL | Prénom du participant |
| last_name | TEXT | | Nom du participant |
| joined_at | TEXT | NOT NULL DEFAULT (datetime('now')) | Date d'inscription |

**Contrainte d'unicité** : `UNIQUE(proposal_id, user_id)` — un utilisateur ne peut rejoindre la même proposition qu'une seule fois.

**Index** : `CREATE INDEX idx_participants_user_day ON participants(user_id);`

## Règles métier sur les données

### Proposition

- **Création** : L'auteur est automatiquement ajouté comme premier participant dans la table `participants`.
- **Non modifiable** : Aucune route UPDATE n'existe pour les propositions.
- **Suppression** : Autorisée uniquement si le seul participant est l'auteur (COUNT des participants avec user_id ≠ author_id = 0).
- **Archivage** : Pas de suppression physique. Les propositions des jours passés restent en base mais ne sont pas retournées par l'API (filtre sur `vote_day`).

### Participation

- **Une seule proposition à la fois** : Avant d'insérer un participant, supprimer toute participation existante de cet user_id pour le même vote_day.
- **Quitter** : Supprimer l'entrée dans `participants`. Si l'utilisateur est l'auteur, il reste dans la table (auto-ajouté à la création).
- **Non anonyme** : first_name est obligatoire (NOT NULL).

### Jour de vote

- **Calcul** : Si heure serveur < 14:00 → aujourd'hui. Si ≥ 14:00 → prochain jour ouvré.
- **Prochain jour ouvré** : Lundi à jeudi → lendemain. Vendredi → lundi. Samedi → lundi. Dimanche → lundi.
- **Validation** : Toute requête POST/DELETE vérifie que le `vote_day` de la proposition cible correspond au jour de vote actif. Sinon → HTTP 409.

## Données côté client (localStorage)

| Clé | Type | Description |
|-----|------|-------------|
| `midivote_user_id` | string (UUID v4) | Identifiant unique généré à la première visite |
| `midivote_first_name` | string | Prénom de l'utilisateur (obligatoire) |
| `midivote_last_name` | string | Nom de l'utilisateur |

## Diagramme des relations

```text
proposals (1) ←──── (N) participants
    │                      │
    │ id ◄────────── proposal_id
    │ author_id             │ user_id
    │ vote_day              │ first_name
    │ restaurant_name       │ last_name
    │ cuisine_type          │
    │ google_maps_link      │
    │ menu_link             │
    │ departure_time        │
    │ meal_format           │
    │ comment               │
    └──────────────────────┘
```
