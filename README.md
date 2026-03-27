# 🍽️ MidiVote

> Application de vote collaboratif pour choisir où déjeuner en équipe.

**MidiVote** permet aux collègues de proposer des restaurants, de rejoindre les propositions des autres et de voir en temps réel combien de personnes partent déjeuner ensemble.

---

## Pourquoi ce projet existe

Ce projet a été créé comme **terrain d'expérimentation pour [GitHub Spec Kit](https://github.com/github/spec-kit)** — une méthode de développement assisté par IA qui structure le travail en étapes progressives :

1. **`/speckit:specify`** — rédiger une spec fonctionnelle à partir d'une description en langage naturel
2. **`/speckit:clarify`** — identifier les zones floues et les faire préciser
3. **`/speckit:plan`** — générer un plan d'implémentation technique
4. **`/speckit:tasks`** — décomposer le plan en tâches actionnables et ordonnées
5. **`/speckit:implement`** — exécuter les tâches une par une avec Claude Code

L'idée : partir d'une phrase comme *"je veux une app pour voter où on mange à midi"* et arriver à une application fonctionnelle, sans écrire une seule ligne de code manuellement.

---

## Fonctionnalités

- **Profil utilisateur** — choisir son prénom/nom avant d'accéder à l'app
- **Proposer un restaurant** — nom, type de cuisine, lien Google Maps, heure de départ, format (sur place / à emporter)
- **Rejoindre ou quitter** une proposition existante
- **Liste des participants** visible sur chaque carte
- **Mise à jour automatique** toutes les 3 secondes (polling)
- **Bannière du jour** — affiche le jour de vote en cours

---

## Stack technique

| Couche | Technologie |
|--------|-------------|
| Frontend | Angular 19 + Angular Material |
| Backend | Express.js (Node.js) |
| Base de données | SQLite (`better-sqlite3`) |
| Communication | REST API + polling côté client |

---

## Lancer le projet

### Backend

```bash
cd backend
npm install
node server.js
# Démarre sur http://localhost:3000
```

### Frontend

```bash
cd frontend
npm install
npx ng serve
# Démarre sur http://localhost:4200
```

---

## Structure du projet

```
midi-vote/
├── backend/
│   ├── db/          # Initialisation SQLite
│   ├── middleware/  # Injection du jour de vote
│   ├── routes/      # API proposals & participants
│   └── server.js
├── frontend/
│   └── src/app/
│       ├── components/   # Avatar, ProposalCard, ParticipantList…
│       ├── pages/        # Welcome, Home
│       └── services/     # Polling, Proposals, User…
└── .specify/             # Templates GitHub Spec Kit
```

---

## À propos de GitHub Spec Kit

Le dossier `.specify/` contient les templates utilisés par Spec Kit pour guider Claude Code à chaque étape du développement. C'est ce qui a permis de construire cette application de façon structurée, en partant de la spécification jusqu'à l'implémentation.

Si vous voulez reproduire cette approche sur un autre projet, les commandes `/speckit:*` sont disponibles dès que le template est installé dans votre repo.