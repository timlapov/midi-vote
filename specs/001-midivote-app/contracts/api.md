# Contrats API REST : MidiVote

**Base URL** : `http://localhost:3000/api`
**Format** : JSON
**Branche** : `001-midivote-app` | **Date** : 2026-03-26

## En-têtes communs

Toutes les requêtes de mutation (POST, DELETE) DOIVENT inclure :
```json
{
  "X-User-Id": "<UUID v4>",
  "X-User-FirstName": "<prénom>",
  "X-User-LastName": "<nom>"
}
```

## Réponses d'erreur communes

| Code | Signification | Body |
|------|---------------|------|
| 400 | Validation échouée | `{ "error": "validation_error", "details": ["champ manquant..."] }` |
| 404 | Ressource non trouvée | `{ "error": "not_found" }` |
| 409 | Jour de vote basculé | `{ "error": "day_switched", "currentVoteDay": "YYYY-MM-DD" }` |

---

## GET /api/vote-day

Retourne le jour de vote actif et les informations de date.

**Réponse 200** :
```json
{
  "voteDay": "2026-03-27",
  "displayLabel": "JEUDI 27 MARS",
  "serverTime": "2026-03-26T15:30:00Z"
}
```

---

## GET /api/proposals

Retourne toutes les propositions du jour de vote actif avec leurs participants, triées par heure de départ croissante.

**Paramètres de requête** : aucun (le jour de vote est calculé côté serveur).

**Réponse 200** :
```json
{
  "voteDay": "2026-03-27",
  "displayLabel": "JEUDI 27 MARS",
  "proposals": [
    {
      "id": 1,
      "restaurantName": "Sushi Palace",
      "cuisineType": "japonais",
      "googleMapsLink": "https://maps.google.com/...",
      "menuLink": "https://sushipalace.fr/menu",
      "departureTime": "12:00",
      "mealFormat": "sur_place",
      "comment": "Très bon rapport qualité-prix",
      "authorId": "uuid-xxx",
      "authorFirstName": "Marie",
      "authorLastName": "Dupont",
      "createdAt": "2026-03-26T15:35:00Z",
      "participants": [
        {
          "userId": "uuid-xxx",
          "firstName": "Marie",
          "lastName": "Dupont"
        },
        {
          "userId": "uuid-yyy",
          "firstName": "Jean",
          "lastName": "Martin"
        }
      ],
      "participantCount": 2
    }
  ]
}
```

---

## POST /api/proposals

Crée une nouvelle proposition pour le jour de vote actif. L'auteur est automatiquement ajouté comme premier participant.

**Headers requis** : `X-User-Id`, `X-User-FirstName`, `X-User-LastName`

**Body** :
```json
{
  "restaurantName": "Sushi Palace",
  "cuisineType": "japonais",
  "googleMapsLink": "https://maps.google.com/...",
  "menuLink": "https://sushipalace.fr/menu",
  "departureTime": "12:30",
  "mealFormat": "sur_place",
  "comment": "Très bon rapport qualité-prix"
}
```

**Validation** :
- `restaurantName` : obligatoire, non vide
- `cuisineType` : obligatoire, non vide
- `googleMapsLink` : obligatoire, non vide
- `menuLink` : optionnel
- `departureTime` : obligatoire, format HH:MM, entre 12:00 et 14:00
- `mealFormat` : obligatoire, valeur parmi `sur_place` | `a_emporter`
- `comment` : optionnel

**Réponse 201** : La proposition créée (même format que dans GET /api/proposals, avec le tableau `participants` contenant l'auteur).

**Réponse 409** : Jour de vote basculé.

---

## DELETE /api/proposals/:id

Supprime une proposition. Autorisé uniquement par l'auteur et seulement si aucun autre participant n'a rejoint.

**Headers requis** : `X-User-Id`

**Réponse 200** :
```json
{ "success": true }
```

**Réponse 403** :
```json
{ "error": "forbidden", "reason": "not_author" }
```
ou
```json
{ "error": "forbidden", "reason": "has_other_participants" }
```

**Réponse 409** : Jour de vote basculé.

---

## POST /api/proposals/:id/join

Rejoint une proposition. Si l'utilisateur participe déjà à une autre proposition du même jour, il en est automatiquement retiré.

**Headers requis** : `X-User-Id`, `X-User-FirstName`, `X-User-LastName`

**Body** : aucun

**Réponse 200** :
```json
{
  "success": true,
  "leftProposalId": 3
}
```
(`leftProposalId` est `null` si l'utilisateur ne participait à aucune autre proposition.)

**Réponse 409** : Jour de vote basculé.

---

## POST /api/proposals/:id/leave

Quitte une proposition. L'auteur de la proposition NE PEUT PAS quitter sa propre proposition (il est participant permanent).

**Headers requis** : `X-User-Id`

**Body** : aucun

**Réponse 200** :
```json
{ "success": true }
```

**Réponse 403** :
```json
{ "error": "forbidden", "reason": "author_cannot_leave" }
```

**Réponse 409** : Jour de vote basculé.
