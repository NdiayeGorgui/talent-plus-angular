import { Component, OnInit } from '@angular/core';
import { HistoriqueDTO, ProcessusDTO, TalentService, UserProfileDTO } from '../../services/talent.service';
import { HistoriqueDialogComponent } from '../historique-dialog/historique-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnakBarComponent } from '../../shared/snak-bar/snak-bar.component';
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
  filteredProcessusList: ProcessusDTO[] = [];
  loading = false;
  candidatId?: number;
  offreId?: number;
  userId?: number;
  role?: string;
  userOffreIds: number[] = [];
  user?: UserProfileDTO;
  searchTerm: string = '';

  constructor(
    private talentService: TalentService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.talentService.getMyProfile().subscribe({
      next: (user) => {
        this.user = user;
        this.userId = user.id;
        this.role = user.role;

        if (this.role === 'RECRUTEUR') {
          this.userOffreIds = user.offres?.map(o => o.id!) || [];
        }

        this.route.paramMap.subscribe(params => {
          const candidatId = params.get('candidatId');
          const offreId = params.get('offreId');

          if (candidatId) {
            this.candidatId = Number(candidatId);
            this.loadProcessusByCandidat(this.candidatId);
          } else if (offreId) {
            this.offreId = Number(offreId);
            this.loadProcessusByOffre(this.offreId);
          } else if (this.role === 'RECRUTEUR') {
            this.loadProcessusParOffres(this.userOffreIds);
          } else {
            this.loadProcessus();
          }
        });
      },
      error: (err) => {
        console.error('Erreur récupération profil', err);
        this.snackBar.openFromComponent(SnakBarComponent, {
          data: { message: '❌ Erreur lors du chargement du profil', type: 'error' },
          duration: 3000
        });
      }
    });
  }

  // 🔹 Chargement par offres
  loadProcessusParOffres(offreIds: number[]): void {
    this.loading = true;
    const all: ProcessusDTO[] = [];

    if (offreIds.length === 0) {
      this.processusList = [];
      this.loading = false;
      return;
    }

    let remaining = offreIds.length;

    offreIds.forEach(id => {
      this.talentService.getProcessusByOffre(id).subscribe({
        next: (data) => all.push(...data),
        error: () => {
          this.snackBar.openFromComponent(SnakBarComponent, {
            data: { message: `⚠️ Erreur chargement offre ${id}`, type: 'error' },
            duration: 3000
          });
        },
        complete: () => {
          remaining--;
          if (remaining === 0) {
            const unique = all.filter((p, i, self) =>
              i === self.findIndex(o => o.id === p.id)
            );
            this.processusList = unique;
            this.filteredProcessusList = unique;
            this.loading = false;
          }
        }
      });
    });
  }

  // 🔹 Couleur du chip
  getChipColor(statut: StatutProcessus): string {
    switch (statut) {
      case StatutProcessus.RECU:
      case StatutProcessus.NON_RETENU:
      case StatutProcessus.ACCEPTE:
        return 'primary';
      case StatutProcessus.ENTRETIEN:
        return 'accent';
      case StatutProcessus.PROPOSITION:
      case StatutProcessus.REFUSE:
        return 'warn';
      default:
        return '';
    }
  }

  // 🔹 Label du statut
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

  // 🔹 Chargement général
  loadProcessus(): void {
    this.loading = true;
    this.talentService.getAllProcessus().subscribe({
      next: (data) => {
        this.processusList = this.role === 'RECRUTEUR'
          ? data.filter(p => this.userOffreIds.includes(p.offreId))
          : data;
        this.filteredProcessusList = this.processusList;
        this.loading = false;
      },
      error: () => {
        this.snackBar.openFromComponent(SnakBarComponent, {
          data: { message: '❌ Erreur lors du chargement des processus', type: 'error' },
          duration: 3000
        });
        this.loading = false;
      }
    });
  }

  // 🔹 Chargement par candidat
  loadProcessusByCandidat(candidatId: number): void {
    this.loading = true;
    this.talentService.getProcessusByCandidat(candidatId).subscribe({
      next: data => {
        this.processusList = data;
        this.filteredProcessusList = data;
        this.loading = false;
      },
      error: () => {
        this.snackBar.openFromComponent(SnakBarComponent, {
          data: { message: '❌ Erreur chargement du candidat', type: 'error' },
          duration: 3000
        });
        this.loading = false;
      }
    });
  }

  // 🔹 Chargement par offre
  loadProcessusByOffre(offreId: number): void {
    this.loading = true;
    this.talentService.getProcessusByOffre(offreId).subscribe({
      next: data => {
        this.processusList = data;
        this.filteredProcessusList = data;
        this.loading = false;
      },
      error: () => {
        this.snackBar.openFromComponent(SnakBarComponent, {
          data: { message: '❌ Erreur chargement de l’offre', type: 'error' },
          duration: 3000
        });
        this.loading = false;
      }
    });
  }

  // 🔹 Changement de statut
  changerStatut(processus: ProcessusDTO, nouveauStatut: string): void {
    this.talentService.changerStatut(processus.id!, nouveauStatut).subscribe({
      next: () => {
        this.snackBar.openFromComponent(SnakBarComponent, {
          data: { message: '✅ Statut mis à jour avec succès', type: 'success' },
          duration: 3000
        });

        // Recharger selon le contexte
        if (this.candidatId) this.loadProcessusByCandidat(this.candidatId);
        else if (this.offreId) this.loadProcessusByOffre(this.offreId);
        else this.loadProcessus();
      },
      error: () => {
        this.snackBar.openFromComponent(SnakBarComponent, {
          data: { message: '❌ Erreur lors de la mise à jour du statut', type: 'error' },
          duration: 3000
        });
      }
    });
  }

  // 🔹 Historique
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

  // 🔹 Filtrage
  applySearchFilter(): void {
    const keyword = this.searchTerm.trim();
    if (!keyword) {
      this.filteredProcessusList = this.processusList;
      return;
    }
    this.filteredProcessusList = this.processusList.filter(p =>
      p.candidatId?.toString().includes(keyword) ||
      p.offreId?.toString().includes(keyword)
    );
  }
}
