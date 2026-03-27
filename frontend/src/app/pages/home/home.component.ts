// Page principale — affichage des propositions du jour de vote
// Titre du jour, bouton proposer, liste des cartes, polling 3 secondes

import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { PollingService } from '../../services/polling.service';
import { ProposalService } from '../../services/proposal.service';
import { ProposalCardComponent } from '../../components/proposal-card/proposal-card.component';
import { ProposalFormComponent } from '../../components/proposal-form/proposal-form.component';
import { DayBannerComponent } from '../../components/day-banner/day-banner.component';
import { NetworkErrorService } from '../../services/network-error.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    ProposalCardComponent,
    DayBannerComponent
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit, OnDestroy {
  readonly pollingService = inject(PollingService);
  readonly networkErrorService = inject(NetworkErrorService);
  private readonly proposalService = inject(ProposalService);
  private readonly dialog = inject(MatDialog);

  ngOnInit(): void {
    this.pollingService.startPolling();
  }

  ngOnDestroy(): void {
    this.pollingService.stopPolling();
  }

  openProposalForm(): void {
    this.dialog.open(ProposalFormComponent, {
      width: '480px',
      maxHeight: '90vh'
    });
  }

  onJoin(proposalId: number): void {
    this.proposalService.joinProposal(proposalId).subscribe({
      next: () => this.pollingService.fetchProposals()
    });
  }

  onLeave(proposalId: number): void {
    this.proposalService.leaveProposal(proposalId).subscribe({
      next: () => this.pollingService.fetchProposals()
    });
  }

  onDelete(proposalId: number): void {
    this.proposalService.deleteProposal(proposalId).subscribe({
      next: () => this.pollingService.fetchProposals()
    });
  }
}
