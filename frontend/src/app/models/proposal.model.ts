// Modèle de proposition de restaurant avec participants

export interface Participant {
  userId: string;
  firstName: string;
  lastName: string;
}

export interface Proposal {
  id: number;
  restaurantName: string;
  cuisineType: string;
  googleMapsLink: string;
  menuLink: string | null;
  departureTime: string;
  mealFormat: 'sur_place' | 'a_emporter';
  comment: string | null;
  authorId: string;
  authorFirstName: string;
  authorLastName: string;
  createdAt: string;
  participants: Participant[];
  participantCount: number;
}

export interface ProposalsResponse {
  voteDay: string;
  displayLabel: string;
  proposals: Proposal[];
}

export interface VoteDayResponse {
  voteDay: string;
  displayLabel: string;
  serverTime: string;
}
