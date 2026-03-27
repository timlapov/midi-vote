# Plan d'implémentation : MidiVote

**Branche** : `001-midivote-app` | **Date** : 2026-03-26 | **Spec** : [spec.md](./spec.md)
**Input** : Spécification fonctionnelle depuis `/specs/001-midivote-app/spec.md`

## Résumé

MidiVote est une application web collaborative permettant aux collègues de proposer et rejoindre des restaurants pour le déjeuner. L'architecture est un frontend Angular communiquant avec un backend Express/SQLite via une API REST. L'identité utilisateur est gérée côté client via localStorage. Le cycle journalier (bascule à 14h00, week-end sauté) est géré côté backend. Les mises à jour temps réel sont assurées par polling court.

## Contexte technique

**Langages/Versions** : TypeScript 5.x (frontend Angular), Node.js 20+ / JavaScript (backend Express)
**Dépendances principales** :
- Frontend : Angular (dernière version stable), Angular Material, Angular Animations, police Poppins (Google Fonts)
- Backend : Express.js, better-sqlite3, cors
**Stockage** : SQLite via better-sqlite3 (propositions, participants) + localStorage côté client (identité utilisateur)
**Tests** : Karma/Jasmine (Angular), tests manuels pour le backend
**Plateforme cible** : Navigateurs web modernes (desktop + mobile), serveur Node.js
**Type de projet** : Application web (frontend + backend léger)
**Objectifs de performance** : Mises à jour visibles en moins de 3 secondes, animations fluides (60 fps)
**Contraintes** : Pas d'authentification serveur, polling court pour le temps réel (simplicité), CORS pour développement local
**Échelle** : ~50 utilisateurs simultanés

**Thème personnalisé** :
- Police : Poppins (Google Fonts)
- Couleur d'accent : RGB(64, 152, 219) — `#4098DB`
- Angular Material avec thème custom

**Ports** :
- Frontend : 4200 (ng serve)
- Backend : 3000 (Express)

## Vérification de conformité (Constitution)

*GATE : Doit passer avant la Phase 0. Revérification après la Phase 1.*

| Principe | Statut | Justification |
|----------|--------|---------------|
| I. Simplicité avant tout | ✅ | Stack minimale (Angular + Express + SQLite). Polling court au lieu de WebSocket pour éviter la complexité. Pas d'ORM, requêtes SQL directes via better-sqlite3. |
| II. Français partout | ✅ | Documentation, specs, plan, commentaires de code en français. Variables/fonctions en anglais. |
| III. Identité légère côté client | ✅ | UUID + prénom/nom stockés dans localStorage. Pas de JWT, pas de sessions, pas de base utilisateurs. Le serveur reçoit l'identifiant client en paramètre. |
| IV. Interface soignée et moderne | ✅ | Angular Material + thème Poppins/#4098DB + Angular Animations pour transitions cartes, compteur, rejoindre/quitter. Responsive par défaut avec Angular Material. |
| V. Fiabilité | ✅ | Gestion HTTP 409 pour conflit de jour, validation côté client et serveur, SQLite fiable sans serveur DB séparé. |

**Résultat** : Tous les principes respectés. Aucune violation.

## Structure du projet

### Documentation (cette fonctionnalité)

```text
specs/001-midivote-app/
├── plan.md              # Ce fichier
├── research.md          # Phase 0 : recherche
├── data-model.md        # Phase 1 : modèle de données
├── quickstart.md        # Phase 1 : guide de démarrage rapide
├── contracts/           # Phase 1 : contrats API
│   └── api.md           # Endpoints REST
└── tasks.md             # Phase 2 : tâches (/speckit.tasks)
```

### Code source (racine du dépôt)

```text
backend/
├── package.json
├── server.js              # Point d'entrée Express
├── db/
│   └── database.js        # Initialisation SQLite + migrations
├── routes/
│   ├── proposals.js       # Routes CRUD propositions
│   └── participants.js    # Routes rejoindre/quitter
├── middleware/
│   └── vote-day.js        # Middleware calcul jour de vote + validation 409
└── utils/
    └── date-helpers.js    # Helpers jour ouvré, basculement 14h00

frontend/
├── angular.json
├── package.json
├── src/
│   ├── styles.scss           # Thème global, Poppins, couleurs
│   ├── app/
│   │   ├── app.component.ts
│   │   ├── app.routes.ts
│   │   ├── guards/
│   │   │   └── profile.guard.ts    # Garde : redirige si pas de prénom
│   │   ├── services/
│   │   │   ├── user.service.ts     # Gestion localStorage (prénom, nom, UUID)
│   │   │   ├── proposal.service.ts # Appels API propositions
│   │   │   └── polling.service.ts  # Polling court pour temps réel
│   │   ├── models/
│   │   │   ├── user.model.ts
│   │   │   └── proposal.model.ts
│   │   ├── pages/
│   │   │   ├── welcome/            # Page d'accueil (saisie prénom/nom)
│   │   │   └── home/               # Page principale (propositions)
│   │   └── components/
│   │       ├── avatar/             # Avatar circulaire + menu modification
│   │       ├── proposal-card/      # Carte de proposition (animée)
│   │       ├── proposal-form/      # Formulaire de proposition (dialog)
│   │       ├── participant-list/   # Liste des participants + compteur
│   │       └── day-banner/         # Bandeau de basculement journalier
│   └── assets/
└── tsconfig.json
```

**Décision de structure** : Architecture web application avec séparation frontend/backend. Le frontend Angular communique avec le backend Express via API REST. SQLite est embarqué dans le backend (pas de serveur DB séparé), conformément au principe de simplicité.

## Suivi de complexité

> Aucune violation de la constitution — section non applicable.
