// Service d'appels API REST pour les propositions et participations
// Ajoute automatiquement les headers X-User-* aux requêtes de mutation

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Proposal, ProposalsResponse, VoteDayResponse } from '../models/proposal.model';
import { UserService } from './user.service';

const API_URL = 'http://localhost:3000/api';

@Injectable({ providedIn: 'root' })
export class ProposalService {
  constructor(
    private readonly http: HttpClient,
    private readonly userService: UserService
  ) {}

  private getUserHeaders(): HttpHeaders {
    return new HttpHeaders({
      'X-User-Id': this.userService.userId(),
      'X-User-FirstName': this.userService.firstName(),
      'X-User-LastName': this.userService.lastName()
    });
  }

  getVoteDay(): Observable<VoteDayResponse> {
    return this.http.get<VoteDayResponse>(`${API_URL}/vote-day`);
  }

  getProposals(): Observable<ProposalsResponse> {
    return this.http.get<ProposalsResponse>(`${API_URL}/proposals`);
  }

  createProposal(data: {
    restaurantName: string;
    cuisineType: string;
    googleMapsLink: string;
    menuLink?: string;
    departureTime: string;
    mealFormat: 'sur_place' | 'a_emporter';
    comment?: string;
  }): Observable<Proposal> {
    return this.http.post<Proposal>(`${API_URL}/proposals`, data, {
      headers: this.getUserHeaders()
    });
  }

  deleteProposal(id: number): Observable<{ success: boolean }> {
    return this.http.delete<{ success: boolean }>(`${API_URL}/proposals/${id}`, {
      headers: this.getUserHeaders()
    });
  }

  joinProposal(id: number): Observable<{ success: boolean; leftProposalId: number | null }> {
    return this.http.post<{ success: boolean; leftProposalId: number | null }>(
      `${API_URL}/proposals/${id}/join`,
      {},
      { headers: this.getUserHeaders() }
    );
  }

  leaveProposal(id: number): Observable<{ success: boolean }> {
    return this.http.post<{ success: boolean }>(
      `${API_URL}/proposals/${id}/leave`,
      {},
      { headers: this.getUserHeaders() }
    );
  }
}
