// Service de communication pour le bandeau de changement de jour
// Utilisé par l'intercepteur HTTP et le composant DayBanner

import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class DayBannerService {
  readonly visible = signal(false);

  show(): void {
    this.visible.set(true);
  }

  hide(): void {
    this.visible.set(false);
  }
}
