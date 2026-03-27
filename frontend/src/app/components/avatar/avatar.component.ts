// Composant avatar — cercle avec initiale du prénom
// Au clic, ouvre un dialog Material pour modifier le profil

import { Component, inject } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { UserService } from '../../services/user.service';
import { EditProfileDialogComponent } from './edit-profile-dialog.component';

@Component({
  selector: 'app-avatar',
  standalone: true,
  imports: [MatButtonModule, MatTooltipModule, MatDialogModule],
  templateUrl: './avatar.component.html',
  styleUrl: './avatar.component.scss'
})
export class AvatarComponent {
  readonly userService = inject(UserService);
  private readonly dialog = inject(MatDialog);

  openEditProfile(): void {
    this.dialog.open(EditProfileDialogComponent, {
      width: '360px',
      data: {
        firstName: this.userService.firstName(),
        lastName: this.userService.lastName()
      }
    });
  }
}
