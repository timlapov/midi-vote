<!--
  Sync Impact Report
  ==================
  Version change: N/A → 1.0.0 (initial ratification)
  Modified principles: N/A (first version)
  Added sections: Core Principles (5), Contraintes techniques,
                  Workflow de développement, Governance
  Removed sections: N/A
  Templates requiring updates:
    - .specify/templates/plan-template.md ✅ compatible (Constitution Check
      section already generic)
    - .specify/templates/spec-template.md ✅ compatible (no auth-specific
      mandatory sections)
    - .specify/templates/tasks-template.md ✅ compatible (phase structure
      aligns with principles)
  Follow-up TODOs: none
-->

# MidiVote Constitution

## Core Principles

### I. Simplicité avant tout

- Chaque fonctionnalité DOIT être implémentée de la manière la plus
  simple possible. Pas de sur-ingénierie.
- Le principe YAGNI (You Ain't Gonna Need It) est appliqué
  systématiquement : aucune abstraction ou couche supplémentaire
  n'est ajoutée sans besoin concret et immédiat.
- En cas de doute entre deux approches, la plus courte et la plus
  directe DOIT être choisie.
- Les dépendances externes DOIVENT être limitées au strict nécessaire.

### II. Français partout

- Toute la documentation (specs, plans, tâches, README) DOIT être
  rédigée en français.
- Les commentaires dans le code DOIVENT être en français.
- Les messages de commit DOIVENT être en français.
- Les noms de variables, fonctions et fichiers restent en anglais
  (convention technique standard).

### III. Identité légère côté client

- L'identité de l'utilisateur est gérée exclusivement côté client
  via `localStorage`.
- Il n'y a PAS de système d'authentification serveur (pas de JWT,
  pas de sessions serveur, pas de base de données utilisateurs).
- L'utilisateur choisit ou génère un identifiant simple (pseudo)
  stocké localement.
- Cette approche est un choix délibéré de simplicité : la confiance
  est accordée au client.

### IV. Interface soignée et moderne

- L'interface utilisateur DOIT être visuellement soignée, moderne
  et responsive.
- Les transitions et animations DOIVENT être présentes pour offrir
  une expérience fluide et agréable.
- L'UI DOIT être intuitive : un nouvel utilisateur DOIT pouvoir
  comprendre le fonctionnement sans explication.
- Le design DOIT fonctionner sur mobile et desktop.

### V. Fiabilité

- Le code DOIT être robuste : les cas limites courants DOIVENT être
  gérés (réseau indisponible, localStorage plein, données corrompues).
- Les erreurs DOIVENT être présentées de manière claire et
  compréhensible à l'utilisateur.
- L'état de l'application DOIT rester cohérent même en cas de
  rechargement de page ou de perte de connexion temporaire.
- La simplicité du système DOIT servir la fiabilité : moins de
  composants = moins de points de défaillance.

## Contraintes techniques

- **Type d'application** : application web collaborative (frontend +
  backend léger).
- **Pas d'authentification complexe** : toute proposition incluant
  OAuth, JWT, sessions serveur ou base utilisateurs DOIT être
  refusée sauf décision explicite d'amendement.
- **Stockage client** : `localStorage` est le mécanisme principal
  pour les données utilisateur côté client.
- **Temps réel** : les mises à jour entre utilisateurs DOIVENT être
  réactives (WebSocket, SSE ou polling court selon le contexte).
- **Déploiement** : l'application DOIT pouvoir être déployée
  simplement, sans infrastructure lourde.

## Workflow de développement

- Chaque fonctionnalité est spécifiée via le système Specify
  (spec → plan → tâches → implémentation).
- Les commits DOIVENT être atomiques et décrire clairement le
  changement effectué, en français.
- Le code DOIT être lisible et auto-documenté autant que possible ;
  les commentaires complètent mais ne remplacent pas un code clair.
- Avant chaque implémentation, vérifier la conformité avec les
  principes de cette constitution (Constitution Check dans le plan).

## Governance

- Cette constitution est le document de référence pour toutes les
  décisions architecturales et de développement du projet MidiVote.
- Tout amendement DOIT être documenté avec une justification, et
  le numéro de version DOIT être incrémenté selon le versionnement
  sémantique :
  - **MAJEUR** : suppression ou redéfinition incompatible d'un
    principe.
  - **MINEUR** : ajout d'un principe ou extension significative.
  - **PATCH** : clarifications, corrections de formulation.
- La conformité aux principes DOIT être vérifiée lors de chaque
  revue de code ou plan d'implémentation.

**Version** : 1.0.0 | **Ratification** : 2026-03-26 | **Dernière modification** : 2026-03-26
