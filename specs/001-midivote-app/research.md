# Recherche : MidiVote

**Branche** : `001-midivote-app` | **Date** : 2026-03-26

## Décisions techniques

### 1. Temps réel : Polling court

**Décision** : Polling HTTP toutes les 3 secondes depuis le frontend.

**Justification** : Conforme au principe I (Simplicité). Pour ~50 utilisateurs avec des mises à jour peu fréquentes (quelques propositions/participations par heure), le polling est largement suffisant. Pas besoin de WebSocket qui ajouterait une dépendance (socket.io), une gestion de connexion et de reconnexion complexe.

**Alternatives considérées** :
- WebSocket (socket.io) : Plus réactif mais sur-dimensionné pour le cas d'usage. Ajoute de la complexité (gestion des connexions, reconnexion, rooms).
- Server-Sent Events (SSE) : Plus simple que WebSocket mais nécessite une gestion des connexions côté serveur. Avantage mineur par rapport au polling pour ~50 utilisateurs.

### 2. Base de données : SQLite via better-sqlite3

**Décision** : SQLite embarqué avec better-sqlite3 (synchrone).

**Justification** : Pas besoin de serveur de base de données séparé. better-sqlite3 est synchrone (pas de callbacks/promises pour les requêtes), ce qui simplifie le code. Parfait pour une application mono-serveur avec ~50 utilisateurs.

**Alternatives considérées** :
- PostgreSQL : Sur-dimensionné, nécessite un serveur séparé.
- JSON fichier : Trop fragile, pas de requêtes complexes, problèmes de concurrence.
- sqlite3 (async) : API asynchrone plus complexe, pas nécessaire ici.

### 3. Gestion de l'identité utilisateur

**Décision** : UUID v4 généré côté client et stocké dans localStorage avec prénom et nom. Le serveur reçoit l'UUID + prénom + nom dans les requêtes.

**Justification** : Conforme au principe III (Identité légère). Pas de table utilisateurs en base. Le serveur stocke l'UUID de l'auteur/participant directement dans les tables propositions et participations. Le prénom et nom sont envoyés à chaque requête pertinente.

**Alternatives considérées** :
- Table utilisateurs en base : Introduirait une forme d'authentification serveur, contraire à la constitution.
- Session cookie : Même problème, trop complexe.

### 4. Gestion du jour de vote et basculement

**Décision** : Le backend calcule le jour de vote actif à chaque requête via un middleware. La logique : si heure < 14h00 → aujourd'hui, sinon → prochain jour ouvré (lundi si vendredi/samedi/dimanche). Les propositions sont filtrées par date de jour de vote.

**Justification** : Logique centralisée côté serveur pour éviter les désynchronisations client/serveur. Le frontend affiche le jour de vote retourné par l'API. Le polling détecte le changement de jour.

**Alternatives considérées** :
- Cron job pour archiver : Ajoute une dépendance (node-cron) et de la complexité. Non nécessaire si on filtre par date à la volée.
- Logique côté client : Risque de désynchronisation entre les fuseaux horaires des clients.

### 5. Communication de l'erreur 409

**Décision** : Lorsqu'une action (créer proposition, rejoindre) cible un jour de vote qui n'est plus actif, le backend retourne HTTP 409 Conflict avec un body JSON `{ error: "day_switched", currentVoteDay: "YYYY-MM-DD" }`. Le frontend intercepte globalement les 409 via un intercepteur HTTP Angular.

**Justification** : Centralise la gestion du conflit de jour dans un seul intercepteur. Le frontend affiche le bandeau animé et recharge les données avec la bonne date.

### 6. Thème Angular Material

**Décision** : Thème personnalisé avec couleur primaire #4098DB (RGB 64, 152, 219), police Poppins via Google Fonts. Utilisation de l'API M3 (Material 3) d'Angular Material avec `@use '@angular/material' as mat`.

**Justification** : Angular Material fournit des composants responsives et accessibles. Le thème custom permet une identité visuelle cohérente.

### 7. Animations

**Décision** : Angular Animations (`@angular/animations`) pour :
- Entrée/sortie des cartes de proposition (slide + fade)
- Animation du compteur de participants (transition numérique)
- Feedback visuel rejoindre/quitter (highlight + scale)
- Bandeau de basculement journalier (slide-down)

**Justification** : Conforme au principe IV (Interface soignée). Angular Animations est intégré au framework, pas de dépendance externe.
