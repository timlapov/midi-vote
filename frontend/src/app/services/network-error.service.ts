// Service de gestion des erreurs réseau
// Affiche un message à l'utilisateur et auto-masque après 5 secondes

import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class NetworkErrorService {
  readonly visible = signal(false);
  readonly message = signal('');

  private timeoutId: ReturnType<typeof setTimeout> | null = null;

  show(msg: string): void {
    this.message.set(msg);
    this.visible.set(true);

    if (this.timeoutId) clearTimeout(this.timeoutId);
    this.timeoutId = setTimeout(() => this.hide(), 5000);
  }

  hide(): void {
    this.visible.set(false);
    this.timeoutId = null;
  }
}
