import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TalentService, OffreDTO, RecruteurDTO } from '../../services/talent.service';

@Component({
  selector: 'app-offre-detail',
  standalone: false,
  templateUrl: './offre-detail.component.html',
  styleUrls: ['./offre-detail.component.css']
})
export class OffreDetailComponent implements OnInit {

  offre?: OffreDTO;
  recruteur?: RecruteurDTO;
  isLoading = true;
  recruteurs: RecruteurDTO[] = [];
  isEditing = false; // <- Ajout du mode édition

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private talentService: TalentService
  ) {}

ngOnInit(): void {
  const id = Number(this.route.snapshot.paramMap.get('id'));
  this.talentService.getOffreById(id).subscribe({
    next: (data) => {
      this.offre = data;
      this.loadRecruteur(data.recruteurId);
      this.loadAllRecruteurs();  // <-- charge la liste des recruteurs ici
      this.isLoading = false;
    },
    error: (err) => {
      console.error("Erreur lors du chargement de l'offre :", err);
      this.isLoading = false;
    }
  });
}

loadAllRecruteurs(): void {
  this.talentService.getRecruteurs().subscribe({
    next: (data) => this.recruteurs = data,
    error: (err) => console.error("Erreur lors du chargement des recruteurs :", err)
  });
}


  loadRecruteur(recruteurId: number): void {
    this.talentService.getRecruteurById(recruteurId).subscribe({
      next: (data) => this.recruteur = data,
      error: (err) => console.warn("Nom du recruteur introuvable :", err)
    });
  }

  goBack(): void {
    this.router.navigate(['/offres']);
  }

  goToEdit(): void {
    this.isEditing = true;
  }

  cancelEdit(): void {
    this.isEditing = false;
    this.ngOnInit(); // Recharge les données depuis le backend
  }

saveChanges(): void {
  if (!this.offre?.id) return;

  this.talentService.updateOffre(this.offre.id, this.offre as OffreDTO).subscribe({
    next: (updated) => {
      this.offre = updated;
      this.isEditing = false;
      alert('✅ Offre mise à jour avec succès !');
    },
    error: (err) => {
      console.error('Erreur lors de la mise à jour :', err);
      alert('❌ Échec de la mise à jour.');
    }
  });
}

  goToWizard(): void {
    if (this.offre?.id) {
      this.router.navigate(['/candidats/postuler', this.offre.id]);
    }
  }

  closeOffre(): void {
    if (!this.offre || !this.offre.active) return;

    if (confirm('Voulez-vous vraiment désactiver cette offre ?')) {
      this.talentService.closeOffre(this.offre.id!).subscribe({
        next: () => {
          this.offre!.active = false;
          alert('Offre désactivée.');
        },
        error: (err) => {
          console.error('Erreur lors de la désactivation :', err);
          alert("Échec de la désactivation de l'offre.");
        }
      });
    }
  }

  openOffre(): void {
    if (!this.offre?.id) return;

    this.talentService.openOffre(this.offre.id).subscribe({
      next: () => {
        this.offre!.active = true;
        alert("✅ Offre réactivée avec succès !");
      },
      error: (err) => {
        console.error('Erreur lors de la réactivation :', err);
        alert("❌ Échec de la réactivation de l'offre.");
      }
    });
  }
}
