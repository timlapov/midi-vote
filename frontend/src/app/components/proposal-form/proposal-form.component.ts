// Dialog de création d'une proposition de restaurant
// Champs : nom, type cuisine, lien Maps, menu, heure départ, format, commentaire

import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatRadioModule } from '@angular/material/radio';
import { MatIconModule } from '@angular/material/icon';
import { ProposalService } from '../../services/proposal.service';
import { PollingService } from '../../services/polling.service';

@Component({
  selector: 'app-proposal-form',
  standalone: true,
  imports: [
    FormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatRadioModule,
    MatIconModule
  ],
  templateUrl: './proposal-form.component.html',
  styleUrl: './proposal-form.component.scss'
})
export class ProposalFormComponent {
  private readonly dialogRef = inject(MatDialogRef<ProposalFormComponent>);
  private readonly proposalService = inject(ProposalService);
  private readonly pollingService = inject(PollingService);

  restaurantName = '';
  cuisineType = '';
  googleMapsLink = '';
  menuLink = '';
  departureTime = '12:00';
  mealFormat: 'sur_place' | 'a_emporter' = 'sur_place';
  comment = '';
  submitting = false;

  get isValid(): boolean {
    return !!(
      this.restaurantName.trim() &&
      this.cuisineType.trim() &&
      this.googleMapsLink.trim() &&
      this.departureTime
    );
  }

  onSubmit(): void {
    if (!this.isValid || this.submitting) return;
    this.submitting = true;

    this.proposalService.createProposal({
      restaurantName: this.restaurantName.trim(),
      cuisineType: this.cuisineType.trim(),
      googleMapsLink: this.googleMapsLink.trim(),
      menuLink: this.menuLink.trim() || undefined,
      departureTime: this.departureTime,
      mealFormat: this.mealFormat,
      comment: this.comment.trim() || undefined
    }).subscribe({
      next: () => {
        this.pollingService.fetchProposals();
        this.dialogRef.close(true);
      },
      error: () => {
        this.submitting = false;
      }
    });
  }
}
