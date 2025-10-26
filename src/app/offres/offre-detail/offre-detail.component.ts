import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TalentService, OffreDTO, RecruteurDTO, PostulerDTO, EmployeurDTO } from '../../services/talent.service';
import { AuthService } from '../../services/auth.service';

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
  isEditing = false;
  canEdit: boolean = false;
  isAdmin: boolean = false;
  isRecruteurOwner: boolean = false;
  isEmployeurOwner: boolean = false;

  quillModules = {
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'],
      ['blockquote', 'code-block'],
      [{ 'header': 1 }, { 'header': 2 }],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      [{ 'script': 'sub' }, { 'script': 'super' }],
      [{ 'indent': '-1' }, { 'indent': '+1' }],
      [{ 'direction': 'rtl' }],
      [{ 'size': ['small', false, 'large', 'huge'] }],
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      [{ 'color': [] }, { 'background': [] }],
      [{ 'font': [] }],
      [{ 'align': [] }],
      ['clean'],
      ['link']
    ]
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private talentService: TalentService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.isAdmin = this.authService.isAdmin();

    const roles = this.authService.getUserRoles();
    this.canEdit = this.isAdmin || roles.includes('ROLE_RECRUTEUR') || roles.includes('ROLE_EMPLOYEUR');

    const id = Number(this.route.snapshot.paramMap.get('id'));

    this.talentService.getOffreById(id).subscribe({
      next: (data) => {
        this.offre = data;
        this.loadRecruteur(data.recruteurId);
        this.loadAllRecruteurs();
        this.isLoading = false;

        const email = this.authService.getCurrentUserEmail();
        if (email && !this.isAdmin) {
          // 🔹 Vérification recruteur propriétaire
          if (roles.includes('ROLE_RECRUTEUR')) {
            this.talentService.getRecruteurIdByEmail(email).subscribe({
              next: (connectedRecruteurId) => {
                this.isRecruteurOwner = connectedRecruteurId === data.recruteurId;
              },
              error: (err) => {
                console.error("Erreur lors de la récupération de l'ID du recruteur :", err);
                this.isRecruteurOwner = false;
              }
            });
          }

          // 🔹 Vérification employeur propriétaire
          if (this.authService.getUserRoles().includes('ROLE_EMPLOYEUR')) {
            const email = this.authService.getCurrentUserEmail();
            if (email && this.offre?.employeurId) {
              this.talentService.getEmployeurByEmail(email).subscribe({
                next: (employeur) => {
                  this.isEmployeurOwner = employeur.id === this.offre!.employeurId;
                  console.log('🏢 Employeur connecté :', employeur.id, '| Offre employeurId :', this.offre!.employeurId);
                },
                error: (err) => {
                  console.error('Erreur lors de la vérification de l’employeur :', err);
                  this.isEmployeurOwner = false;
                }
              });
            }
          }

        }
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
    this.ngOnInit(); // recharge les données
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
  goToWizardOrPostuler() {
    const email = this.authService.getCurrentUserEmail();

    if (!email) {
      alert('Erreur : utilisateur non identifié.');
      return;
    }

    if (!this.offre || typeof this.offre.id !== 'number') {
      alert('Erreur : offre invalide ou ID manquant.');
      return;
    }

    this.talentService.getCandidatByEmail(email).subscribe({
      next: (candidat) => {
        const candidatId = candidat.id!;
        const offreId = this.offre!.id!;

        // 🧠 Vérification si déjà postulé
        this.talentService.hasAlreadyApplied(candidatId, offreId).subscribe({
          next: (alreadyApplied) => {
            if (alreadyApplied) {
              alert('⚠️ Vous avez déjà postulé à cette offre.');
              return;
            }

            // 🟢 Sinon, postuler
            const postulerDto: PostulerDTO = { candidatId, offreId };

            this.talentService.postuler(postulerDto).subscribe({
              next: (processus) => {
                alert('✅ Postulation réussie');
                this.router.navigate(['/processus', processus.id]);
              },
              error: (err) => {
                console.error('Erreur postulation', err);
                alert('❌ Une erreur est survenue lors de la postulation.');
              }
            });
          },
          error: (err) => {
            console.error("Erreur lors de la vérification de la postulation :", err);
            alert("❌ Impossible de vérifier si vous avez déjà postulé.");
          }
        });
      },
      error: (err) => {
        if (err.status === 404) {
          // 🟠 Pas encore de dossier → rediriger vers le wizard
          this.router.navigate(['/candidats/postuler', this.offre!.id!]);
        } else {
          console.error('Erreur API candidat :', err);
          alert('❌ Impossible de récupérer le dossier candidat.');
        }
      }
    });
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
