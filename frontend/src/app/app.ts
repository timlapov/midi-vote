// Composant racine de l'application MidiVote
// Affiche l'avatar en haut de page si le profil est complet

import { Component, inject, computed } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { UserService } from './services/user.service';
import { AvatarComponent } from './components/avatar/avatar.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, AvatarComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  private readonly userService = inject(UserService);
  readonly showAvatar = computed(() => this.userService.isProfileComplete());
}
