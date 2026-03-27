# Guide de démarrage rapide : MidiVote

**Branche** : `001-midivote-app` | **Date** : 2026-03-26

## Prérequis

- Node.js 20+ installé
- npm installé
- Angular CLI installé globalement (`npm install -g @angular/cli`)

## Installation

### Backend

```bash
cd backend
npm install
```

### Frontend

```bash
cd frontend
npm install
```

## Lancement en développement

### 1. Démarrer le backend (port 3000)

```bash
cd backend
node server.js
```

Le serveur Express démarre sur `http://localhost:3000`. La base SQLite est créée automatiquement au premier lancement (`backend/db/midivote.db`).

### 2. Démarrer le frontend (port 4200)

```bash
cd frontend
ng serve
```

L'application Angular est accessible sur `http://localhost:4200`.

## Vérification

1. Ouvrir `http://localhost:4200` dans un navigateur
2. La page d'accueil demande de saisir un prénom et un nom
3. Après saisie, la page principale affiche le titre du jour de vote en cours
4. Proposer un restaurant et vérifier que la carte apparaît
5. Ouvrir un second navigateur/onglet privé pour tester avec un autre utilisateur

## Structure des fichiers

```text
midi-vote/
├── backend/
│   ├── package.json
│   ├── server.js
│   ├── db/
│   ├── routes/
│   ├── middleware/
│   └── utils/
├── frontend/
│   ├── angular.json
│   ├── package.json
│   └── src/
└── specs/
    └── 001-midivote-app/
```

## Commandes utiles

| Commande | Description |
|----------|-------------|
| `cd backend && node server.js` | Démarrer le backend |
| `cd frontend && ng serve` | Démarrer le frontend en dev |
| `cd frontend && ng build` | Build de production du frontend |

## Points d'attention

- Le fichier SQLite (`midivote.db`) est créé automatiquement dans `backend/db/`.
- Le CORS est configuré pour accepter les requêtes depuis `http://localhost:4200`.
- Le basculement journalier à 14h00 utilise le fuseau horaire du serveur.
- Pour simuler un basculement, modifier l'heure système du serveur ou ajuster temporairement la constante dans `backend/utils/date-helpers.js`.
