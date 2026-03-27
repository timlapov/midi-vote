// Service de gestion de l'identité utilisateur via localStorage
// Génère un UUID v4 au premier accès, stocke prénom et nom

import { Injectable, signal, computed } from '@angular/core';
import { User } from '../models/user.model';

const STORAGE_KEYS = {
  userId: 'midivote_user_id',
  firstName: 'midivote_first_name',
  lastName: 'midivote_last_name'
} as const;

@Injectable({ providedIn: 'root' })
export class UserService {
  private readonly _firstName = signal(localStorage.getItem(STORAGE_KEYS.firstName) ?? '');
  private readonly _lastName = signal(localStorage.getItem(STORAGE_KEYS.lastName) ?? '');
  private readonly _userId = signal(this.getOrCreateUserId());

  readonly firstName = this._firstName.asReadonly();
  readonly lastName = this._lastName.asReadonly();
  readonly userId = this._userId.asReadonly();

  readonly isProfileComplete = computed(() => this._firstName().trim().length > 0);

  readonly initials = computed(() => {
    const fn = this._firstName();
    return fn ? fn.charAt(0).toUpperCase() : '?';
  });

  readonly user = computed<User>(() => ({
    userId: this._userId(),
    firstName: this._firstName(),
    lastName: this._lastName()
  }));

  private getOrCreateUserId(): string {
    let id = localStorage.getItem(STORAGE_KEYS.userId);
    if (!id) {
      id = crypto.randomUUID();
      localStorage.setItem(STORAGE_KEYS.userId, id);
    }
    return id;
  }

  updateProfile(firstName: string, lastName: string): void {
    this._firstName.set(firstName);
    this._lastName.set(lastName);
    localStorage.setItem(STORAGE_KEYS.firstName, firstName);
    localStorage.setItem(STORAGE_KEYS.lastName, lastName);
  }
}
