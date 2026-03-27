# Tâches : MidiVote

**Input** : Documents de design depuis `/specs/001-midivote-app/`
**Prérequis** : plan.md (requis), spec.md (requis), research.md, data-model.md, contracts/

**Tests** : Non demandés dans la spécification — aucune tâche de test générée.

**Organisation** : Tâches groupées par scénario utilisateur pour permettre l'implémentation et le test indépendant de chaque scénario.

## Format : `[ID] [P?] [Story] Description`

- **[P]** : Parallélisable (fichiers différents, pas de dépendances)
- **[Story]** : Scénario utilisateur concerné (US1, US2, US3, US4, US5)
- Chemins de fichiers exacts inclus dans les descriptions

## Conventions de chemins

- **Backend** : `backend/`
- **Frontend** : `frontend/src/app/`

---

## Phase 1 : Setup (Infrastructure partagée)

**Objectif** : Initialisation du projet et structure de base

- [x] T001 Créer la structure de répertoires du projet selon le plan (`backend/`, `frontend/`) à la racine du dépôt
- [x] T002 Initialiser le projet backend Node.js avec `npm init` et installer les dépendances (express, better-sqlite3, cors) dans `backend/package.json`
- [x] T003 [P] Initialiser le projet Angular avec Angular CLI (`ng new`) dans `frontend/`, installer Angular Material et configurer Angular Animations dans `frontend/angular.json`
- [x] T004 [P] Configurer le thème personnalisé Angular Material (couleur accent #4098DB, police Poppins via Google Fonts) dans `frontend/src/styles.scss`

---

## Phase 2 : Fondations (Prérequis bloquants)

**Objectif** : Infrastructure de base qui DOIT être complétée avant tout scénario utilisateur

**⚠️ CRITIQUE** : Aucun travail sur les scénarios utilisateur ne peut commencer avant la fin de cette phase

- [x] T005 Créer le module d'initialisation SQLite avec les tables `proposals` et `participants` (schéma depuis data-model.md) dans `backend/db/database.js`
- [x] T006 [P] Créer les fonctions utilitaires de calcul du jour de vote (avant/après 14h00, saut du week-end, prochain jour ouvré) dans `backend/utils/date-helpers.js`
- [x] T007 [P] Créer le middleware Express de calcul du jour de vote actif et validation 409 dans `backend/middleware/vote-day.js`
- [x] T008 Configurer le serveur Express avec CORS (origin localhost:4200), parsing JSON, et montage des routes dans `backend/server.js`
- [x] T009 [P] Créer les interfaces TypeScript `User` et `Proposal` (avec participants) dans `frontend/src/app/models/user.model.ts` et `frontend/src/app/models/proposal.model.ts`
- [x] T010 [P] Implémenter le `UserService` pour la gestion localStorage (UUID, prénom, nom) dans `frontend/src/app/services/user.service.ts`
- [x] T011 [P] Implémenter le `PollingService` pour le polling HTTP toutes les 3 secondes dans `frontend/src/app/services/polling.service.ts`
- [x] T012 Implémenter le `ProposalService` avec les appels API REST (GET/POST/DELETE proposals, join, leave, vote-day) et les headers X-User-* dans `frontend/src/app/services/proposal.service.ts`
- [x] T013 Créer l'intercepteur HTTP Angular pour gérer globalement les erreurs 409 (bandeau animé + rechargement des données) dans `frontend/src/app/services/http-error.interceptor.ts`
- [x] T014 Configurer le routage Angular avec les routes `/welcome` et `/home` et le guard de profil dans `frontend/src/app/app.routes.ts`
- [x] T015 [P] Implémenter le `ProfileGuard` qui redirige vers `/welcome` si le prénom n'est pas défini dans localStorage dans `frontend/src/app/guards/profile.guard.ts`
- [x] T016 Configurer le `AppComponent` avec le router-outlet et l'import des modules Angular Material dans `frontend/src/app/app.component.ts`
- [x] T016b Implémenter les routes GET `/api/proposals` (propositions du jour de vote actif avec participants, triées par heure de départ croissante) et GET `/api/vote-day` (jour de vote actif + label d'affichage) dans `backend/routes/proposals.js`

**Checkpoint** : Fondations prêtes — l'implémentation des scénarios utilisateur peut commencer

---

## Phase 3 : Scénario 1 — Créer son profil (Priorité : P1) 🎯 MVP

**Objectif** : L'utilisateur peut saisir son prénom et nom, voir son avatar, et modifier ses informations

**Test indépendant** : Ouvrir l'application → page d'accueil s'affiche → saisir prénom/nom → avatar visible → cliquer sur avatar → modifier les informations

### Implémentation du scénario 1

- [x] T017 [US1] Créer le composant `WelcomePage` avec formulaire de saisie prénom (obligatoire) et nom, validation, et redirection vers `/home` après soumission dans `frontend/src/app/pages/welcome/welcome.component.ts` et `.html` et `.scss`
- [x] T018 [US1] Créer le composant `Avatar` avec cercle affichant l'initiale du prénom, menu de modification au clic (dialog Material avec formulaire pré-rempli) dans `frontend/src/app/components/avatar/avatar.component.ts` et `.html` et `.scss`
- [x] T019 [US1] Intégrer le composant `Avatar` dans le layout principal de `AppComponent` (visible en haut de page sur toutes les routes protégées) dans `frontend/src/app/app.component.html`

**Checkpoint** : Le scénario 1 est fonctionnel et testable indépendamment

---

## Phase 4 : Scénario 2 — Proposer un restaurant (Priorité : P1)

**Objectif** : Un utilisateur identifié peut créer une proposition de restaurant et la voir affichée comme carte

**Test indépendant** : Se connecter → cliquer sur « Proposer » → remplir le formulaire → valider → la carte apparaît avec animation. Tenter de supprimer une proposition sans autre participant → succès. Avec d'autres participants → suppression indisponible.

### Implémentation du scénario 2

- [x] T020 [US2] Implémenter la route POST `/api/proposals` avec validation des champs obligatoires, insertion en base, et ajout automatique de l'auteur comme participant dans `backend/routes/proposals.js`
- [x] T021 [US2] Implémenter la route DELETE `/api/proposals/:id` avec vérification auteur + absence d'autres participants dans `backend/routes/proposals.js`
- [x] T022 [US2] Créer le composant `ProposalForm` (dialog Angular Material) avec les champs : nom restaurant, type cuisine, lien Google Maps, lien menu (optionnel), heure de départ (time picker 12:00-14:00), format repas (radio sur_place/a_emporter), commentaire (optionnel) dans `frontend/src/app/components/proposal-form/proposal-form.component.ts` et `.html` et `.scss`
- [x] T023 [US2] Créer le composant `ProposalCard` avec affichage de toutes les informations de la proposition (nom, cuisine, liens cliquables, heure, format, commentaire, auteur) et bouton de suppression conditionnel dans `frontend/src/app/components/proposal-card/proposal-card.component.ts` et `.html` et `.scss`
- [x] T024 [US2] Ajouter les animations Angular sur `ProposalCard` : animation d'entrée (slide+fade à la création), animation de sortie (à la suppression) dans `frontend/src/app/components/proposal-card/proposal-card.component.ts`

**Checkpoint** : Le scénario 2 est fonctionnel — les propositions peuvent être créées et affichées

---

## Phase 5 : Scénario 3 — Rejoindre une proposition (Priorité : P1)

**Objectif** : Un utilisateur peut rejoindre une proposition, changer de groupe, ou quitter

**Test indépendant** : Rejoindre une carte → nom apparaît dans la liste avec animation → rejoindre une autre carte → retiré automatiquement de la première → cliquer « Quitter » → retiré sans rejoindre aucun groupe

### Implémentation du scénario 3

- [x] T025 [US3] Implémenter la route POST `/api/proposals/:id/join` avec retrait automatique de la proposition précédente (même vote_day) dans `backend/routes/participants.js`
- [x] T026 [US3] Implémenter la route POST `/api/proposals/:id/leave` avec interdiction pour l'auteur de quitter sa propre proposition dans `backend/routes/participants.js`
- [x] T027 [US3] Créer le composant `ParticipantList` avec affichage des prénoms/noms et compteur animé dans `frontend/src/app/components/participant-list/participant-list.component.ts` et `.html` et `.scss`
- [x] T028 [US3] Ajouter les boutons « Rejoindre » et « Quitter » sur `ProposalCard` avec logique conditionnelle (rejoindre si pas membre, quitter si membre et non auteur) dans `frontend/src/app/components/proposal-card/proposal-card.component.ts` et `.html`
- [x] T029 [US3] Ajouter les animations Angular : feedback visuel au rejoindre/quitter (highlight + scale), animation du compteur de participants (transition numérique) dans `frontend/src/app/components/participant-list/participant-list.component.ts` et `frontend/src/app/components/proposal-card/proposal-card.component.ts`

**Checkpoint** : Le scénario 3 est fonctionnel — les utilisateurs peuvent rejoindre, changer et quitter des propositions

---

## Phase 6 : Scénario 4 — Affichage des propositions du jour (Priorité : P1)

**Objectif** : Page principale avec titre du jour, cartes triées par heure de départ, mises à jour temps réel, responsive mobile

**Test indépendant** : Ouvrir l'application → titre affiche le bon jour/date → propositions triées par heure de départ → ouvrir un second navigateur → créer une proposition → visible dans le premier sans rechargement → tester sur mobile → interface utilisable

### Implémentation du scénario 4

- [x] T031 [US4] Créer la page `HomePage` avec le titre du jour de vote (« PROPOSITIONS DE DÉJEUNER — [JOUR] [DATE] »), le bouton « Proposer un restaurant », la liste des cartes, et le message d'encouragement si aucune proposition dans `frontend/src/app/pages/home/home.component.ts` et `.html` et `.scss`
- [x] T032 [US4] Intégrer le `PollingService` dans `HomePage` pour actualiser les propositions et le jour de vote toutes les 3 secondes dans `frontend/src/app/pages/home/home.component.ts`
- [x] T033 [US4] Optimiser l'affichage responsive de la page principale et des cartes pour mobile (layout flex/grid adaptatif, cartes pleine largeur sur petit écran) dans `frontend/src/app/pages/home/home.component.scss` et `frontend/src/app/components/proposal-card/proposal-card.component.scss`

**Checkpoint** : Le scénario 4 est fonctionnel — la page affiche les propositions en temps réel avec le bon titre

---

## Phase 7 : Scénario 5 — Cycle journalier automatique (Priorité : P2)

**Objectif** : À 14h00, basculement automatique vers le jour ouvré suivant. Vendredi → lundi. HTTP 409 pour les actions sur un jour expiré.

**Test indépendant** : Après 14h00, le titre affiche le jour suivant → les anciennes propositions disparaissent → tenter de créer une proposition pour l'ancien jour → bandeau animé s'affiche → données rechargées

### Implémentation du scénario 5

- [x] T034 [US5] Appliquer le middleware `vote-day` aux routes POST/DELETE de propositions et participants pour valider que le jour de vote de la proposition cible correspond au jour actif (sinon 409) dans `backend/server.js`
- [x] T035 [US5] Créer le composant `DayBanner` avec le bandeau animé « C'est terminé pour aujourd'hui ! Tu peux créer ou voter pour le déjeuner de demain ! » (slide-down + auto-masquage après 5 secondes) dans `frontend/src/app/components/day-banner/day-banner.component.ts` et `.html` et `.scss`
- [x] T036 [US5] Intégrer la détection de changement de jour dans le `PollingService` : comparer le `voteDay` retourné avec le jour actuellement affiché, déclencher le rechargement complet des données si changement dans `frontend/src/app/services/polling.service.ts` et `frontend/src/app/pages/home/home.component.ts`
- [x] T037 [US5] Connecter l'intercepteur HTTP 409 au `DayBanner` : afficher le bandeau et déclencher le rechargement des données via le `PollingService` dans `frontend/src/app/services/http-error.interceptor.ts` et `frontend/src/app/components/day-banner/day-banner.component.ts`

**Checkpoint** : Le scénario 5 est fonctionnel — le cycle journalier bascule automatiquement et gère les conflits

---

## Phase 8 : Finitions et transversalités

**Objectif** : Améliorations transversales à tous les scénarios

- [x] T038 [P] Vérifier et harmoniser les messages d'erreur en français (validation formulaire, erreurs serveur, bandeau 409) dans tous les composants frontend
- [x] T039 [P] Vérifier les commentaires de code en français dans tous les fichiers backend et frontend
- [x] T040 Vérifier le bon fonctionnement complet en suivant le scénario de `specs/001-midivote-app/quickstart.md`
- [x] T041 [P] Nettoyer les fichiers par défaut d'Angular CLI non utilisés (composants de démo, tests générés) dans `frontend/src/`
- [x] T042 Ajouter la gestion des erreurs réseau (timeout, serveur indisponible) dans l'intercepteur HTTP : afficher un message clair en français à l'utilisateur et permettre un retry automatique du polling dans `frontend/src/app/services/http-error.interceptor.ts`

---

## Dépendances et ordre d'exécution

### Dépendances entre phases

- **Setup (Phase 1)** : Aucune dépendance — peut commencer immédiatement
- **Fondations (Phase 2)** : Dépend de la Phase 1 — BLOQUE tous les scénarios utilisateur
- **US1 Profil (Phase 3)** : Dépend de la Phase 2
- **US2 Proposer (Phase 4)** : Dépend de la Phase 2 + Phase 3 (l'utilisateur doit être identifié)
- **US3 Rejoindre (Phase 5)** : Dépend de la Phase 4 (les propositions doivent exister)
- **US4 Affichage (Phase 6)** : Dépend de la Phase 4 et Phase 5 (cartes et participants). Les routes GET backend sont déjà en Phase 2.
- **US5 Cycle journalier (Phase 7)** : Dépend de la Phase 6 (page complète)
- **Finitions (Phase 8)** : Dépend de toutes les phases précédentes

### Au sein de chaque scénario

- Backend (routes) avant frontend (composants consommant l'API)
- Composants parents avant composants enfants
- Logique métier avant animations

### Opportunités de parallélisation

- Phase 1 : T003 et T004 en parallèle
- Phase 2 : T006, T007, T009, T010, T011, T015 en parallèle (fichiers indépendants)
- Phase 4 : T020 puis T021 (même fichier `proposals.js`)
- Phase 5 : T025 puis T026 (même fichier `participants.js`)
- Phase 8 : T038, T039, T041 en parallèle

---

## Exemple de parallélisation : Phase 2

```bash
# Lancer en parallèle (fichiers indépendants) :
Tâche : "Fonctions utilitaires jour de vote dans backend/utils/date-helpers.js"
Tâche : "Middleware vote-day dans backend/middleware/vote-day.js"
Tâche : "Interfaces TypeScript dans frontend/src/app/models/"
Tâche : "UserService localStorage dans frontend/src/app/services/user.service.ts"
Tâche : "PollingService dans frontend/src/app/services/polling.service.ts"
Tâche : "ProfileGuard dans frontend/src/app/guards/profile.guard.ts"
```

---

## Stratégie d'implémentation

### MVP d'abord (Scénarios 1 + 2 seulement)

1. Compléter Phase 1 : Setup
2. Compléter Phase 2 : Fondations (CRITIQUE)
3. Compléter Phase 3 : Profil utilisateur
4. Compléter Phase 4 : Proposer un restaurant
5. **ARRÊT et VALIDATION** : Un utilisateur peut créer son profil et proposer un restaurant
6. Démontrer si prêt

### Livraison incrémentale

1. Setup + Fondations → Infrastructure prête
2. + Profil (US1) → L'utilisateur peut s'identifier
3. + Proposer (US2) → Les propositions apparaissent (MVP !)
4. + Rejoindre (US3) → Les groupes se forment
5. + Affichage (US4) → Page complète avec temps réel
6. + Cycle journalier (US5) → Automatisation complète
7. Finitions → Application prête pour la production

---

## Notes

- [P] = fichiers différents, pas de dépendances
- [Story] = lien vers le scénario utilisateur pour la traçabilité
- Committer après chaque tâche ou groupe logique
- S'arrêter à chaque checkpoint pour valider le scénario indépendamment
- Éviter : tâches vagues, conflits de fichiers, dépendances inter-scénarios qui brisent l'indépendance
