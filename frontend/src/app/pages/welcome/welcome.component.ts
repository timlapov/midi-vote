// Page d'accueil — saisie du prénom (obligatoire) et nom
// Redirige vers /home après soumission

import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-welcome',
  standalone: true,
  imports: [
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './welcome.component.html',
  styleUrl: './welcome.component.scss'
})
export class WelcomeComponent {
  firstName = '';
  lastName = '';

  constructor(
    private readonly userService: UserService,
    private readonly router: Router
  ) {}

  get isValid(): boolean {
    return this.firstName.trim().length > 0;
  }

  onSubmit(): void {
    if (!this.isValid) return;
    this.userService.updateProfile(this.firstName.trim(), this.lastName.trim());
    this.router.navigate(['/home']);
  }
}
