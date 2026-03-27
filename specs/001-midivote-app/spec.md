# Spécification fonctionnelle : MidiVote

**Branche** : `001-midivote-app`
**Créée le** : 2026-03-26
**Statut** : Brouillon
**Description** : Application web collaborative permettant aux collègues de proposer et rejoindre des restaurants pour le déjeuner.

## Clarifications

### Session 2026-03-26

- Q : L'utilisateur peut-il interagir sans prénom ? → A : Non. Une page d'accueil bloque toute interaction (proposer, rejoindre) tant que le prénom n'est pas saisi.
- Q : Une proposition peut-elle être supprimée si des participants l'ont rejointe ? → A : Non. Une proposition NE PEUT PAS être supprimée si des participants (autres que le proposant) l'ont rejointe.
- Q : Quelles animations sont attendues ? → A : Transition à l'ouverture des cartes, animation du compteur de participants, feedback visuel au moment où l'utilisateur rejoint ou quitte une proposition.
- Q : L'interface doit-elle être responsive ? → A : Oui. Sur mobile, l'interface DOIT rester pleinement utilisable.
- Q : Que se passe-t-il si le cycle journalier a déjà basculé côté serveur ? → A : Le serveur retourne HTTP 409. Le frontend affiche un bandeau animé « C'est terminé pour aujourd'hui ! Tu peux créer ou voter pour le déjeuner de demain ! » et recharge automatiquement les données sans rechargement complet de la page.
- Q : Un utilisateur peut-il quitter une proposition sans en rejoindre une autre ? → A : Oui. Un utilisateur peut se retirer d'une proposition et ne participer à aucun groupe.
- Q : L'application fonctionne-t-elle le week-end ? → A : Non. Le week-end est sauté : vendredi à 14h00 bascule directement vers lundi.
- Q : Le proposant peut-il modifier sa proposition après création ? → A : Non. Aucune modification possible après création (supprimer et recréer si nécessaire).
- Q : Dans quel ordre les propositions sont-elles affichées ? → A : Par heure de départ croissante (12h00 → 14h00).
- Q : Le proposant peut-il supprimer sa proposition s'il est le seul participant ? → A : Oui. Le proposant peut supprimer sa proposition tant qu'aucun autre participant ne l'a rejointe.

## Scénarios utilisateur et tests *(obligatoire)*

### Scénario 1 — Créer son profil (Priorité : P1)

Lors de sa première visite, l'utilisateur est accueilli par une page d'accueil l'invitant à saisir son prénom (obligatoire) et son nom. Tant que le prénom n'est pas saisi, aucune interaction n'est possible : l'utilisateur ne peut ni proposer ni rejoindre un restaurant. Ces informations sont enregistrées localement sur son appareil. Un avatar circulaire affichant l'initiale de son prénom apparaît ensuite en haut de l'interface. En cliquant sur cet avatar, il peut modifier ses informations à tout moment.

**Pourquoi cette priorité** : Sans identité, aucune action n'est possible dans l'application. C'est le prérequis à toute interaction.

**Test indépendant** : Un nouvel utilisateur peut saisir son prénom et son nom, voir son avatar s'afficher, puis modifier ses informations en cliquant dessus.

**Scénarios d'acceptation** :

1. **Étant donné** un utilisateur visitant l'application pour la première fois, **Quand** il arrive sur la page, **Alors** une page d'accueil s'affiche avec un formulaire de saisie du prénom (obligatoire) et du nom, bloquant tout accès au reste de l'application.
2. **Étant donné** un utilisateur n'ayant pas encore saisi son prénom, **Quand** il tente d'accéder aux propositions, **Alors** il est redirigé vers la page d'accueil de saisie du profil.
3. **Étant donné** un utilisateur ayant saisi son prénom et son nom, **Quand** il valide le formulaire, **Alors** ses informations sont stockées localement et un avatar circulaire avec l'initiale de son prénom apparaît en haut de la page.
4. **Étant donné** un utilisateur identifié, **Quand** il clique sur son avatar, **Alors** un formulaire de modification de son prénom et nom s'affiche avec les valeurs actuelles pré-remplies.
5. **Étant donné** un utilisateur revenant sur l'application, **Quand** la page se charge, **Alors** ses informations sont automatiquement récupérées et son avatar s'affiche sans redemander de saisie.

---

### Scénario 2 — Proposer un restaurant (Priorité : P1)

Un utilisateur identifié peut proposer un ou plusieurs restaurants pour le jour de vote en cours. Il remplit un formulaire contenant le nom du restaurant, le type de cuisine, un lien Google Maps, une heure de départ, le format du repas (sur place ou à emporter) et optionnellement un lien menu et un commentaire. Une proposition NE PEUT PAS être modifiée après création. Le proposant peut supprimer sa proposition uniquement si aucun autre participant ne l'a rejointe.

**Pourquoi cette priorité** : Sans propositions, il n'y a rien à afficher ni à rejoindre. C'est la fonctionnalité fondatrice de l'application.

**Test indépendant** : Un utilisateur peut remplir le formulaire de proposition et voir sa proposition apparaître sous forme de carte sur la page.

**Scénarios d'acceptation** :

1. **Étant donné** un utilisateur identifié, **Quand** il clique sur le bouton de proposition, **Alors** un formulaire s'affiche avec les champs : nom du restaurant (obligatoire), type de cuisine (obligatoire), lien Google Maps (obligatoire), lien menu (optionnel), heure de départ entre 12h00 et 14h00 (obligatoire), format du repas — sur place ou à emporter (obligatoire), commentaire (optionnel).
2. **Étant donné** un formulaire correctement rempli, **Quand** l'utilisateur valide, **Alors** la proposition apparaît immédiatement sous forme de carte avec une animation de transition, et le proposant est automatiquement ajouté comme premier participant.
3. **Étant donné** un formulaire avec des champs obligatoires manquants, **Quand** l'utilisateur tente de valider, **Alors** les champs manquants sont mis en évidence avec un message d'erreur clair.
4. **Étant donné** un utilisateur ayant déjà fait une proposition, **Quand** il souhaite proposer un autre restaurant, **Alors** il peut créer une nouvelle proposition sans limite.
5. **Étant donné** un utilisateur tentant de créer une proposition après le basculement journalier (14h00), **Quand** le serveur détecte le décalage, **Alors** il retourne HTTP 409, le frontend affiche un bandeau animé « C'est terminé pour aujourd'hui ! Tu peux créer ou voter pour le déjeuner de demain ! » et recharge les données automatiquement.
6. **Étant donné** un proposant dont la proposition n'a aucun autre participant, **Quand** il clique sur « Supprimer », **Alors** la proposition est supprimée avec une animation de fermeture.
7. **Étant donné** un proposant dont la proposition a été rejointe par d'autres participants, **Quand** il consulte sa carte, **Alors** l'option de suppression n'est pas disponible.

---

### Scénario 3 — Rejoindre une proposition (Priorité : P1)

Chaque utilisateur peut rejoindre une seule proposition à la fois, signifiant « je viens avec ce groupe ». La liste des participants est visible sous chaque carte. Changer d'avis est possible : rejoindre une autre proposition quitte automatiquement la précédente. Un utilisateur peut également quitter une proposition sans en rejoindre une autre. Rejoindre ou quitter déclenche un feedback visuel animé.

**Pourquoi cette priorité** : C'est le mécanisme de vote central de l'application. Sans possibilité de rejoindre, les propositions n'ont pas de sens collaboratif.

**Test indépendant** : Un utilisateur peut cliquer sur « Rejoindre » sur une carte, voir son nom apparaître dans la liste des participants avec une animation, puis changer de proposition ou quitter.

**Scénarios d'acceptation** :

1. **Étant donné** un utilisateur identifié visualisant les propositions, **Quand** il clique sur « Rejoindre » sur une carte, **Alors** son prénom et nom apparaissent dans la liste des participants avec un feedback visuel animé et le compteur de participants s'incrémente avec une animation.
2. **Étant donné** un utilisateur ayant déjà rejoint une proposition A, **Quand** il rejoint une proposition B, **Alors** il est automatiquement retiré de la proposition A (avec animation de retrait) et ajouté à la proposition B (avec animation d'ajout).
3. **Étant donné** un utilisateur ayant rejoint une proposition, **Quand** il clique sur « Quitter », **Alors** il est retiré de la proposition (avec animation de retrait) et ne participe à aucun groupe.
4. **Étant donné** un utilisateur ayant rejoint une proposition, **Quand** il consulte la carte, **Alors** un indicateur visuel montre clairement qu'il fait partie de ce groupe.
5. **Étant donné** une proposition avec des participants, **Quand** n'importe quel utilisateur consulte la page, **Alors** la liste complète des participants (prénom et nom) est visible sous chaque carte avec le nombre total de participants.
6. **Étant donné** un utilisateur tentant de rejoindre une proposition après le basculement journalier (14h00), **Quand** le serveur détecte le décalage, **Alors** il retourne HTTP 409 et le frontend affiche le bandeau animé de basculement et recharge les données.

---

### Scénario 4 — Affichage des propositions du jour (Priorité : P1)

La page principale affiche un titre indiquant clairement le jour et la date du vote en cours (ex : « PROPOSITIONS DE DÉJEUNER — JEUDI 26 MARS »). Les propositions sont présentées sous forme de cartes animées triées par heure de départ croissante, avec toutes les informations et la liste des participants.

**Pourquoi cette priorité** : C'est l'interface principale de consultation. Sans affichage clair, l'application n'est pas utilisable.

**Test indépendant** : En ouvrant l'application, l'utilisateur voit le titre avec la date correcte et les propositions existantes sous forme de cartes triées par heure de départ.

**Scénarios d'acceptation** :

1. **Étant donné** un utilisateur ouvrant l'application, **Quand** la page se charge, **Alors** un titre en haut affiche « PROPOSITIONS DE DÉJEUNER — [JOUR] [DATE] » correspondant au jour de vote en cours.
2. **Étant donné** des propositions existantes pour le jour en cours, **Quand** la page se charge, **Alors** chaque proposition est affichée sous forme de carte (avec animation d'ouverture) contenant : nom du restaurant, type de cuisine, lien Google Maps (cliquable), lien menu (si fourni, cliquable), heure de départ, format du repas, commentaire (si fourni), liste des participants avec compteur. Les cartes sont triées par heure de départ croissante.
3. **Étant donné** aucune proposition pour le jour en cours, **Quand** la page se charge, **Alors** un message invite les utilisateurs à proposer un restaurant.
4. **Étant donné** plusieurs utilisateurs connectés simultanément, **Quand** une nouvelle proposition est créée ou un participant rejoint, **Alors** tous les utilisateurs voient la mise à jour sans avoir à recharger la page.
5. **Étant donné** un utilisateur sur mobile, **Quand** il consulte la page, **Alors** l'interface est pleinement utilisable avec un affichage adapté à la taille de l'écran.

---

### Scénario 5 — Cycle journalier automatique (Priorité : P2)

À 14h00, les propositions du jour en cours sont archivées et le vote pour le jour ouvré suivant s'ouvre automatiquement. Le vendredi à 14h00, le basculement se fait directement vers lundi (le week-end est sauté). Le titre et les propositions affichées se mettent à jour en conséquence. Les actions sur l'ancien jour sont rejetées par le serveur avec HTTP 409.

**Pourquoi cette priorité** : Fonctionnalité importante pour l'automatisation du flux quotidien, mais l'application reste utilisable manuellement sans elle dans un premier temps.

**Test indépendant** : Après 14h00, la page affiche automatiquement le titre du jour ouvré suivant et un espace vierge pour de nouvelles propositions. Le vendredi après 14h00, le titre affiche lundi.

**Scénarios d'acceptation** :

1. **Étant donné** un utilisateur consultant la page avant 14h00 un jour de semaine, **Quand** l'horloge atteint 14h00, **Alors** le titre se met à jour pour afficher le jour ouvré suivant et les propositions actuelles sont remplacées par un espace vierge pour les nouvelles propositions.
2. **Étant donné** un utilisateur arrivant sur la page après 14h00, **Quand** la page se charge, **Alors** le titre affiche le jour ouvré suivant et seules les propositions de ce jour (s'il y en a) sont visibles.
3. **Étant donné** des propositions existantes pour le jour en cours, **Quand** le basculement à 14h00 se produit, **Alors** ces propositions sont archivées et ne sont plus affichées sur la page principale.
4. **Étant donné** un vendredi à 14h00, **Quand** le basculement se produit, **Alors** le titre affiche le lundi suivant (le week-end est sauté).
5. **Étant donné** un utilisateur tentant une action (proposer/rejoindre) sur un jour déjà basculé, **Quand** le serveur reçoit la requête, **Alors** il retourne HTTP 409 et le frontend affiche le bandeau « C'est terminé pour aujourd'hui ! Tu peux créer ou voter pour le déjeuner de demain ! » puis recharge automatiquement les données du jour de vote actif.

---

### Cas limites

- Que se passe-t-il si l'utilisateur efface ses données de navigateur (localStorage) ? → Il est traité comme un nouvel utilisateur et doit ressaisir son prénom et nom. Ses participations précédentes restent visibles côté serveur avec son ancien identifiant.
- Que se passe-t-il si deux utilisateurs saisissent le même prénom et nom ? → Chaque utilisateur possède un identifiant unique généré automatiquement. Les homonymes sont distingués par cet identifiant interne.
- Que se passe-t-il si un utilisateur propose un restaurant puis le jour change (après 14h00) ? → Sa proposition reste dans les archives du jour concerné. Il peut proposer de nouveau pour le jour suivant.
- Que se passe-t-il si aucune proposition n'existe pour un jour donné ? → Un message d'encouragement invite les utilisateurs à être les premiers à proposer un restaurant.
- Que se passe-t-il si un utilisateur tente de rejoindre sa propre proposition ? → Il est automatiquement participant en tant que proposant. Un clic sur « Rejoindre » de sa propre carte n'a pas d'effet supplémentaire.
- Que se passe-t-il si un utilisateur tente de supprimer une proposition que d'autres participants ont rejointe ? → La suppression est interdite. Seule une proposition sans autre participant que le proposant peut être supprimée par son auteur.
- Que se passe-t-il si une action est envoyée au serveur après le basculement journalier ? → Le serveur retourne HTTP 409, le frontend affiche un bandeau animé de notification et recharge les données du jour actif sans rechargement complet de la page.
- Que se passe-t-il le week-end ? → L'application ne propose pas de vote le week-end. Le vendredi à 14h00, le basculement passe directement au lundi.

## Exigences *(obligatoire)*

### Exigences fonctionnelles

- **EF-001** : Le système DOIT afficher une page d'accueil obligatoire pour la saisie du prénom (obligatoire) et du nom lors de la première visite, bloquant tout accès aux autres fonctionnalités.
- **EF-002** : Le système NE DOIT PAS permettre à un utilisateur sans prénom de proposer ou rejoindre un restaurant.
- **EF-003** : Le système DOIT afficher un avatar circulaire avec l'initiale du prénom de l'utilisateur en haut de l'interface.
- **EF-004** : Le système DOIT permettre à l'utilisateur de modifier son prénom et son nom en cliquant sur son avatar.
- **EF-005** : Le système DOIT permettre à tout utilisateur identifié de proposer un restaurant avec les champs : nom (obligatoire), type de cuisine (obligatoire), lien Google Maps (obligatoire), lien menu (optionnel), heure de départ entre 12h00 et 14h00 (obligatoire), format du repas — sur place ou à emporter (obligatoire), commentaire (optionnel).
- **EF-006** : Le système DOIT permettre à un utilisateur de créer plusieurs propositions sans limite.
- **EF-007** : Le système NE DOIT PAS permettre la modification d'une proposition après sa création.
- **EF-008** : Le système DOIT permettre au proposant de supprimer sa proposition uniquement si aucun autre participant ne l'a rejointe.
- **EF-009** : Le système NE DOIT PAS permettre la suppression d'une proposition si des participants (autres que le proposant) l'ont rejointe.
- **EF-010** : Le système DOIT permettre à chaque utilisateur de rejoindre une seule proposition à la fois.
- **EF-011** : Le système DOIT retirer automatiquement un utilisateur de sa proposition actuelle lorsqu'il en rejoint une nouvelle.
- **EF-012** : Le système DOIT permettre à un utilisateur de quitter une proposition sans en rejoindre une autre (ne participer à aucun groupe).
- **EF-013** : Le système DOIT afficher la liste des participants (prénom et nom) sous chaque proposition avec un compteur.
- **EF-014** : Le système DOIT afficher un titre avec le jour et la date du vote en cours en haut de la page (ex : « PROPOSITIONS DE DÉJEUNER — JEUDI 26 MARS »).
- **EF-015** : Le système DOIT afficher les propositions sous forme de cartes triées par heure de départ croissante, contenant toutes les informations de la proposition.
- **EF-016** : Le système DOIT archiver les propositions du jour à 14h00 et ouvrir automatiquement le vote pour le jour ouvré suivant.
- **EF-017** : Le système DOIT sauter le week-end : le vendredi à 14h00, le basculement se fait vers lundi.
- **EF-018** : Le système DOIT mettre à jour le titre et les propositions affichées en temps réel lors du basculement journalier.
- **EF-019** : Le système DOIT refléter en temps réel les nouvelles propositions et les changements de participants pour tous les utilisateurs connectés.
- **EF-020** : Le système NE DOIT PAS permettre le vote anonyme — chaque participation est associée à un prénom et nom visibles.
- **EF-021** : Le système DOIT valider les champs obligatoires avant de permettre la soumission d'une proposition.
- **EF-022** : Le système DOIT animer les transitions d'ouverture des cartes, le compteur de participants, et le feedback visuel lors d'un « rejoindre » ou « quitter ».
- **EF-023** : Le système DOIT être pleinement utilisable sur mobile avec un affichage responsive.
- **EF-024** : Le système DOIT retourner HTTP 409 lorsqu'une action est tentée sur un jour de vote déjà basculé, afficher un bandeau animé « C'est terminé pour aujourd'hui ! Tu peux créer ou voter pour le déjeuner de demain ! » et recharger automatiquement les données sans rechargement complet de la page.

### Entités clés

- **Utilisateur** : Identifiant unique généré automatiquement, prénom (obligatoire), nom. Stocké localement côté client. Référencé côté serveur par son identifiant pour les participations.
- **Proposition** : Nom du restaurant, type de cuisine, lien Google Maps, lien menu (optionnel), heure de départ (12h00–14h00), format du repas (sur place / à emporter), commentaire (optionnel), auteur (utilisateur), date du jour de vote, liste des participants. Non modifiable après création. Supprimable par le proposant uniquement si aucun autre participant ne l'a rejointe.
- **Jour de vote** : Date cible des propositions. Avant 14h00 = aujourd'hui, après 14h00 = jour ouvré suivant (week-end sauté). Les propositions sont regroupées par jour de vote. Les actions sur un jour basculé sont rejetées avec HTTP 409.

## Critères de succès *(obligatoire)*

### Résultats mesurables

- **CS-001** : Un nouvel utilisateur peut créer son profil et proposer un restaurant en moins de 2 minutes lors de sa première visite.
- **CS-002** : Un utilisateur peut rejoindre une proposition en un seul clic.
- **CS-003** : Les mises à jour (nouvelles propositions, changements de participants) sont visibles par tous les utilisateurs connectés en moins de 3 secondes.
- **CS-004** : Le basculement journalier à 14h00 se produit automatiquement sans intervention manuelle et sans rechargement de page.
- **CS-005** : L'application est utilisable sur mobile et desktop sans perte de fonctionnalité.
- **CS-006** : 100 % des informations d'une proposition sont visibles sur sa carte sans action supplémentaire (pas de clic pour « voir plus »).
- **CS-007** : Les animations (ouverture de carte, compteur, rejoindre/quitter) sont perceptibles et fluides (pas de saccade visible à l'œil nu).

## Hypothèses

- Les utilisateurs disposent d'une connexion internet stable (application web en ligne).
- L'application est destinée à une équipe de taille raisonnable (jusqu'à ~50 utilisateurs simultanés).
- Le fuseau horaire de référence pour le basculement à 14h00 est celui du serveur (configurable).
- Les archives des jours passés ne sont pas consultables dans cette version — seul le jour de vote en cours est affiché.
- Les liens Google Maps et menu fournis par les utilisateurs sont considérés comme valides (pas de vérification côté serveur).
- Le proposant d'un restaurant est automatiquement ajouté comme premier participant de sa proposition.
- L'application ne fonctionne que les jours ouvrés (lundi à vendredi).
