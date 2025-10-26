import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TalentService, OffreDTO } from '../../services/talent.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-offres-list',
  standalone: false,
  templateUrl: './offres-list.component.html',
  styleUrls: ['./offres-list.component.css']
})
export class OffresListComponent implements OnInit {

  offres: OffreDTO[] = [];
  displayedColumns: string[] = ['id', 'titre', 'categorie', 'ville', 'datePublication', 'active', 'actions'];
  isLoading = true;

  // droits globaux
  isAdmin = false;
  isEmployeur = false;

  // id de l'employeur connecté (si role employeur)
  currentEmployeurId?: number;

  // bouton candidatures spontanées visible uniquement si candidat connecté ET n'a pas de dossier candidat
  canShowCandidature = false;

  searchKeyword: string = '';
  filteredOffres: OffreDTO[] = [];

  constructor(
    private talentService: TalentService,
    private router: Router,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    const roles = this.authService.getUserRoles();
    const email = this.authService.getCurrentUserEmail();

    this.isAdmin = roles.includes('ROLE_ADMIN');
    this.isEmployeur = roles.includes('ROLE_EMPLOYEUR');

    // Si employeur connecté, récupérer son id (pour permission suppression)
    if (this.isEmployeur && email) {
      this.talentService.getEmployeurByEmail(email).subscribe({
        next: (emp) => {
          if (emp && emp.id) {
            this.currentEmployeurId = emp.id;
            console.log('Employeur connecté id =', this.currentEmployeurId);
          }
          this.loadOffres();
        },
        error: (err) => {
          console.warn('Impossible de récupérer l\'employeur connecté (non bloquant) :', err);
          // charger quand même les offres (on ne pourra pas supprimer côté UI)
          this.loadOffres();
        }
      });
    } else {
      // pas employeur → on charge tout de suite
      this.loadOffres();
    }

    // Si candidat connecté, vérifier s'il a déjà un dossier candidat ; si non -> bouton visible
    if (roles.includes('ROLE_CANDIDAT') && email) {
      this.checkIfCandidatHasNoProfile(email);
    } else {
      this.canShowCandidature = false;
    }
  }

  loadOffres(): void {
    this.isLoading = true;
    this.talentService.getOffres().subscribe({
      next: (data) => {
        this.offres = data || [];
        this.filteredOffres = [...this.offres];
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Erreur lors du chargement des offres : ', err);
        this.isLoading = false;
      }
    });
  }

  applyFilter(): void {
    const keyword = this.searchKeyword.toLowerCase().trim();
    this.filteredOffres = this.offres.filter(o =>
      (o.titre?.toLowerCase().includes(keyword) ?? false) ||
      (o.ville?.toLowerCase().includes(keyword) ?? false) ||
      (o.categorie?.toLowerCase().includes(keyword) ?? false)
    );
  }

  clearSearch(): void {
    this.searchKeyword = '';
    this.filteredOffres = [...this.offres];
  }

  viewOffre(id: number): void {
    this.router.navigate(['/offres', id]);
  }

  /**
   * Vérifie si l'utilisateur actuel peut supprimer l'offre.
   * - admin : true
   * - employeur : true seulement si offre.employeurId === currentEmployeurId
   * - autres : false
   */
  canDeleteOffre(offre: OffreDTO): boolean {
    if (this.isAdmin) return true;
    if (this.isEmployeur && this.currentEmployeurId != null && offre.employeurId === this.currentEmployeurId) return true;
    return false;
  }

  deleteOffre(id: number): void {
    // on vérifie côté UI aussi si l'utilisateur a le droit
    const offre = this.offres.find(o => o.id === id);
    if (!offre) return;

    if (!this.canDeleteOffre(offre)) {
      alert('Accès refusé : vous ne pouvez supprimer que vos propres offres.');
      return;
    }

    if (!confirm('Voulez-vous vraiment supprimer cette offre ?')) return;

    this.talentService.deleteOffre(id).subscribe({
      next: () => {
        // mise à jour UI
        this.offres = this.offres.filter(o => o.id !== id);
        this.filteredOffres = this.filteredOffres.filter(o => o.id !== id);
      },
      error: (err) => {
        console.error('Erreur suppression offre', err);
        alert('Erreur lors de la suppression.');
      }
    });
  }

  /**
   * Redirection pour création d'offre :
   * - admin : direct
   * - employeur : si profil existant -> create, sinon -> wizard
   */
  goToCreateOffre(): void {
    const email = this.authService.getCurrentUserEmail();
    const roles = this.authService.getUserRoles();

    if (!email) {
      alert('Erreur : utilisateur non connecté.');
      return;
    }

    const isAdmin = roles.includes('ROLE_ADMIN');
    const isEmployeur = roles.includes('ROLE_EMPLOYEUR');

    if (isAdmin) {
      this.router.navigate(['/offres/create']);
      return;
    }

    if (isEmployeur) {
      this.talentService.getEmployeurByEmail(email).subscribe({
        next: (employeur) => {
          if (employeur) {
            this.router.navigate(['/offres/create']);
          } else {
            this.router.navigate(['/employeurs/employeur-wizard']);
          }
        },
        error: (err) => {
          if (err?.status === 404) {
            this.router.navigate(['/employeurs/employeur-wizard']);
          } else {
            console.error('Erreur API employeur :', err);
            alert('Impossible de vérifier le profil employeur.');
          }
        }
      });
    } else {
      alert('⛔ Accès refusé : seuls les employeurs et administrateurs peuvent créer des offres.');
    }
  }

  /**
   * Vérifie si le candidat n'a PAS de dossier dans le service candidat -> si oui afficher le bouton candidatures spontanées
   * (vérification par email)
   */
  private checkIfCandidatHasNoProfile(email: string): void {
    this.talentService.getCandidatByEmail(email).subscribe({
      next: (candidat) => {
        // si le service retourne un objet candidat, il a déjà un dossier -> on cache le bouton
        this.canShowCandidature = !candidat;
      },
      error: (err) => {
        if (err?.status === 404) {
          // pas de dossier candidat -> afficher bouton
          this.canShowCandidature = true;
        } else {
          console.error('Erreur API candidat :', err);
          this.canShowCandidature = false;
        }
      }
    });
  }
}
