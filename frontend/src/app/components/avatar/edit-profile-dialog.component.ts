// Dialog de modification du profil utilisateur
// Formulaire pré-rempli avec prénom et nom actuels

import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-edit-profile-dialog',
  standalone: true,
  imports: [
    FormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  template: `
    <h2 mat-dialog-title>Modifier mon profil</h2>
    <mat-dialog-content>
      <mat-form-field appearance="outline" class="full-width">
        <mat-label>Prénom</mat-label>
        <input matInput [(ngModel)]="firstName" required autofocus>
      </mat-form-field>
      <mat-form-field appearance="outline" class="full-width">
        <mat-label>Nom</mat-label>
        <input matInput [(ngModel)]="lastName">
      </mat-form-field>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Annuler</button>
      <button mat-flat-button color="primary"
              [disabled]="!firstName.trim()"
              (click)="save()">
        Enregistrer
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    .full-width { width: 100%; }
    mat-dialog-content { display: flex; flex-direction: column; gap: 8px; padding-top: 8px; }
  `]
})
export class EditProfileDialogComponent {
  private readonly dialogRef = inject(MatDialogRef<EditProfileDialogComponent>);
  private readonly data = inject<{ firstName: string; lastName: string }>(MAT_DIALOG_DATA);
  private readonly userService = inject(UserService);

  firstName = this.data.firstName;
  lastName = this.data.lastName;

  save(): void {
    if (!this.firstName.trim()) return;
    this.userService.updateProfile(this.firstName.trim(), this.lastName.trim());
    this.dialogRef.close();
  }
}
