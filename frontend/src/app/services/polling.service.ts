// Service de polling HTTP pour actualiser les propositions toutes les 3 secondes
// Émet les données via des signaux réactifs

import { Injectable, signal, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ProposalsResponse } from '../models/proposal.model';

const API_URL = 'http://localhost:3000/api';
const POLL_INTERVAL = 3000;

@Injectable({ providedIn: 'root' })
export class PollingService implements OnDestroy {
  private intervalId: ReturnType<typeof setInterval> | null = null;

  readonly proposals = signal<ProposalsResponse | null>(null);
  readonly voteDay = signal<string>('');
  readonly displayLabel = signal<string>('');
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);

  // Signal pour détecter un changement de jour
  readonly dayChanged = signal(false);

  constructor(private readonly http: HttpClient) {}

  startPolling(): void {
    if (this.intervalId) return;
    this.fetchProposals();
    this.intervalId = setInterval(() => this.fetchProposals(), POLL_INTERVAL);
  }

  stopPolling(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  fetchProposals(): void {
    this.http.get<ProposalsResponse>(`${API_URL}/proposals`).subscribe({
      next: (data) => {
        const previousDay = this.voteDay();
        if (previousDay && previousDay !== data.voteDay) {
          this.dayChanged.set(true);
        }
        this.voteDay.set(data.voteDay);
        this.displayLabel.set(data.displayLabel);
        this.proposals.set(data);
        this.loading.set(false);
        this.error.set(null);
      },
      error: (err) => {
        if (err.status !== 409) {
          this.error.set('Erreur de connexion au serveur');
        }
        this.loading.set(false);
      }
    });
  }

  acknowledgeDayChange(): void {
    this.dayChanged.set(false);
  }

  ngOnDestroy(): void {
    this.stopPolling();
  }
}
