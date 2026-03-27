// Bandeau animé de changement de jour
// Affiché quand le cycle journalier bascule (HTTP 409 ou détection par polling)
// Auto-masquage après 5 secondes

import { Component, inject, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { trigger, transition, style, animate } from '@angular/animations';
import { DayBannerService } from '../../services/day-banner.service';
import { PollingService } from '../../services/polling.service';

@Component({
  selector: 'app-day-banner',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  template: `
    @if (bannerService.visible()) {
      <div class="day-banner" @slideDown>
        <mat-icon>schedule</mat-icon>
        <span>C'est terminé pour aujourd'hui ! Tu peux créer ou voter pour le déjeuner de demain !</span>
      </div>
    }
  `,
  styles: [`
    .day-banner {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 12px;
      padding: 12px 24px;
      background: linear-gradient(135deg, var(--midivote-accent), var(--midivote-accent-dark));
      color: white;
      font-weight: 500;
      text-align: center;
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      z-index: 1000;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
    }

    mat-icon {
      font-size: 24px;
      width: 24px;
      height: 24px;
    }

    @media (max-width: 600px) {
      .day-banner {
        font-size: 0.85rem;
        padding: 10px 16px;
      }
    }
  `],
  animations: [
    trigger('slideDown', [
      transition(':enter', [
        style({ transform: 'translateY(-100%)' }),
        animate('300ms ease-out', style({ transform: 'translateY(0)' }))
      ]),
      transition(':leave', [
        animate('200ms ease-in', style({ transform: 'translateY(-100%)' }))
      ])
    ])
  ]
})
export class DayBannerComponent {
  readonly bannerService = inject(DayBannerService);
  private readonly pollingService = inject(PollingService);

  constructor() {
    // Auto-masquage après 5 secondes et gestion du changement de jour détecté par polling
    effect(() => {
      if (this.bannerService.visible()) {
        setTimeout(() => this.bannerService.hide(), 5000);
      }
    });

    effect(() => {
      if (this.pollingService.dayChanged()) {
        this.bannerService.show();
        this.pollingService.acknowledgeDayChange();
      }
    });
  }
}
