import { Component, OnInit } from '@angular/core';
import { HistoriqueDTO, ProcessusDTO, TalentService } from '../../services/talent.service';
import { HistoriqueDialogComponent } from '../historique-dialog/historique-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { StatutProcessus } from '../../model/statut-processus.enum';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-recrutements-list',
  standalone: false,
  templateUrl: './recrutements-list.component.html',
  styleUrl: './recrutements-list.component.css'
})
export class RecrutementsListComponent implements OnInit {
  displayedColumns: string[] = ['candidat', 'offre', 'statut', 'date', 'actions'];
  processusList: ProcessusDTO[] = [];
  loading = false;
  candidatId?: number;
  offreId?: number;


  constructor(
    private talentService: TalentService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
     private route: ActivatedRoute
  ) {}

ngOnInit(): void {
  this.route.paramMap.subscribe(params => {
    const candidatId = params.get('candidatId');
    const offreId = params.get('offreId');

    if (candidatId) {
      this.candidatId = Number(candidatId); // 👉 stocker l’ID
      this.loadProcessusByCandidat(this.candidatId);
    } else if (offreId) {
      this.offreId = Number(offreId);
      this.loadProcessusByOffre(this.offreId);
    } else {
      this.loadProcessus(); // vue globale
    }
  });
}


    getChipColor(statut: StatutProcessus): string {
    switch (statut) {
      case StatutProcessus.RECU: return 'primary';
      case StatutProcessus.NON_RETENU: return 'primary';
      case StatutProcessus.ENTRETIEN: return 'accent';
      case StatutProcessus.PROPOSITION: return 'warn';
      case StatutProcessus.ACCEPTE: return 'primary';
      case StatutProcessus.REFUSE: return 'warn';
      default: return '';
    }
  }

  mapStatutLabel(statut: StatutProcessus): string {
    switch (statut) {
      case StatutProcessus.RECU: return 'Reçue';
      case StatutProcessus.NON_RETENU: return 'Non retenu';
      case StatutProcessus.ENTRETIEN: return 'Entretien';
      case StatutProcessus.PROPOSITION: return 'Proposition';
      case StatutProcessus.ACCEPTE: return 'Acceptée';
      case StatutProcessus.REFUSE: return 'Refusée';
      default: return statut;
    }
  }

  loadProcessus(): void {
    this.loading = true;
    this.talentService.getAllProcessus().subscribe({
      next: (data) => {
        this.processusList = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Erreur récupération processus', err);
        this.snackBar.open('Erreur lors du chargement', 'Fermer', { duration: 3000 });
        this.loading = false;
      }
    });
  }

  loadProcessusByCandidat(candidatId: number): void {
    this.loading = true;
    this.talentService.getProcessusByCandidat(candidatId).subscribe({
      next: data => { this.processusList = data; this.loading = false; },
      error: () => { this.snackBar.open('Erreur chargement candidat', 'Fermer', { duration: 3000 }); this.loading = false; }
    });
  }

  loadProcessusByOffre(offreId: number): void {
    this.loading = true;
    this.talentService.getProcessusByOffre(offreId).subscribe({
      next: data => { this.processusList = data; this.loading = false; },
      error: () => { this.snackBar.open('Erreur chargement offre', 'Fermer', { duration: 3000 }); this.loading = false; }
    });
  }



 changerStatut(processus: ProcessusDTO, nouveauStatut: string): void {
  this.talentService.changerStatut(processus.id!, nouveauStatut).subscribe({
    next: () => {
      this.snackBar.open('Statut mis à jour ✅', 'Fermer', { duration: 3000 });

      // Recharger la bonne liste selon le contexte
      if (this.candidatId) {
        this.loadProcessusByCandidat(this.candidatId);
      } else if (this.offreId) {
        this.loadProcessusByOffre(this.offreId);
      } else {
        this.loadProcessus();
      }
    },
    error: () => {
      this.snackBar.open('Erreur mise à jour statut ❌', 'Fermer', { duration: 3000 });
    }
  });
}


  voirHistorique(processus: ProcessusDTO): void {
    this.talentService.getHistorique(processus.id!).subscribe({
      next: (hist: HistoriqueDTO[]) => {
        this.dialog.open(HistoriqueDialogComponent, {
          width: '500px',
          data: { processus, historique: hist }
        });
      }
    });
  }
}
