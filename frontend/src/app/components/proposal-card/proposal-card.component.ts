// Carte de proposition de restaurant
// Affiche toutes les informations, participants, boutons rejoindre/quitter/supprimer
// Animations d'entrée (slide+fade) et de sortie

import { Component, Input, Output, EventEmitter, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { trigger, transition, style, animate } from '@angular/animations';
import { Proposal } from '../../models/proposal.model';
import { UserService } from '../../services/user.service';
import { ParticipantListComponent } from '../participant-list/participant-list.component';

@Component({
  selector: 'app-proposal-card',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatTooltipModule,
    ParticipantListComponent
  ],
  templateUrl: './proposal-card.component.html',
  styleUrl: './proposal-card.component.scss',
  animations: [
    trigger('cardAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('300ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ]),
      transition(':leave', [
        animate('200ms ease-in', style({ opacity: 0, transform: 'scale(0.95)' }))
      ])
    ]),
    trigger('joinFeedback', [
      transition(':enter', [
        style({ transform: 'scale(0.8)', opacity: 0 }),
        animate('200ms ease-out', style({ transform: 'scale(1)', opacity: 1 }))
      ])
    ])
  ]
})
export class ProposalCardComponent {
  @Input({ required: true }) proposal!: Proposal;
  @Output() join = new EventEmitter<number>();
  @Output() leave = new EventEmitter<number>();
  @Output() delete = new EventEmitter<number>();

  private readonly userService = inject(UserService);

  readonly isAuthor = computed(() => this.proposal?.authorId === this.userService.userId());

  readonly isParticipant = computed(() =>
    this.proposal?.participants.some(p => p.userId === this.userService.userId()) ?? false
  );

  readonly canDelete = computed(() => {
    if (!this.isAuthor()) return false;
    const otherParticipants = this.proposal.participants.filter(
      p => p.userId !== this.userService.userId()
    );
    return otherParticipants.length === 0;
  });

  readonly canLeave = computed(() => this.isParticipant() && !this.isAuthor());

  readonly canJoin = computed(() => !this.isParticipant());

  get mealFormatLabel(): string {
    return this.proposal.mealFormat === 'sur_place' ? 'Sur place' : 'À emporter';
  }

  get mealFormatIcon(): string {
    return this.proposal.mealFormat === 'sur_place' ? 'restaurant' : 'takeout_dining';
  }

  onJoin(): void {
    this.join.emit(this.proposal.id);
  }

  onLeave(): void {
    this.leave.emit(this.proposal.id);
  }

  onDelete(): void {
    this.delete.emit(this.proposal.id);
  }
}
