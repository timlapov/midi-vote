// Liste des participants d'une proposition
// Affiche prénoms/noms avec compteur animé

import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { trigger, transition, style, animate } from '@angular/animations';
import { Participant } from '../../models/proposal.model';

@Component({
  selector: 'app-participant-list',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatChipsModule],
  templateUrl: './participant-list.component.html',
  styleUrl: './participant-list.component.scss',
  animations: [
    trigger('participantAnim', [
      transition(':enter', [
        style({ opacity: 0, transform: 'scale(0.8)' }),
        animate('200ms ease-out', style({ opacity: 1, transform: 'scale(1)' }))
      ]),
      transition(':leave', [
        animate('150ms ease-in', style({ opacity: 0, transform: 'scale(0.8)' }))
      ])
    ]),
    trigger('counterAnim', [
      transition(':increment', [
        style({ transform: 'scale(1.3)', color: 'var(--midivote-accent)' }),
        animate('300ms ease-out', style({ transform: 'scale(1)' }))
      ]),
      transition(':decrement', [
        style({ transform: 'scale(0.8)' }),
        animate('300ms ease-out', style({ transform: 'scale(1)' }))
      ])
    ])
  ]
})
export class ParticipantListComponent {
  @Input({ required: true }) participants: Participant[] = [];

  trackByUserId(_index: number, participant: Participant): string {
    return participant.userId;
  }
}
