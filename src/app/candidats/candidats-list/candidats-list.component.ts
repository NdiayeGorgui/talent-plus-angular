import { Component, OnInit } from '@angular/core';
import { TalentService, CandidatDTO } from '../../services/talent.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-candidats-list',
  standalone: false,
  templateUrl: './candidats-list.component.html',
  styleUrls: ['./candidats-list.component.css']
})
export class CandidatsListComponent implements OnInit {

  candidats: CandidatDTO[] = [];
  displayedColumns: string[] = ['id', 'nom', 'prenom', 'email', 'telephone', 'actions'];
  isLoading = true;
  isAdmin = false;
  isRecruteur = false;
  searchKeyword: string = '';
  filteredCandidats: CandidatDTO[] = [];


  constructor(private talentService: TalentService, private authService: AuthService) {}

  ngOnInit(): void {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = JSON.parse(atob(token.split('.')[1]));
        console.log("✅ Token décodé :", decoded);
      } catch (e) {
        console.error("Erreur lors du décodage du token :", e);
      }
    } else {
      console.warn("Aucun token trouvé dans le localStorage");
    }

    this.loadCandidats();
  }

  loadCandidats(): void {
    this.isLoading = true;
    const roles = this.authService.getUserRoles();
    const email = this.authService.getCurrentUserEmail();

    this.isAdmin = roles.includes('ROLE_ADMIN');
    this.isRecruteur = roles.includes('ROLE_RECRUTEUR');

    console.log("Rôles :", roles);
    console.log("Email récupéré du token :", email);

    // 🧩 Cas 1 : ADMIN → charger tous les candidats
    if (this.isAdmin) {
      this.talentService.getCandidats().subscribe({
        next: (candidats) => {
          this.candidats = candidats;
          this.filteredCandidats = candidats; // <-- utile pour afficher initialement tous les résultats
          this.isLoading = false;
        },
        error: (err) => {
          console.error('Erreur chargement candidats (admin) :', err);
          this.isLoading = false;
        }
      });
      return;
    }

    // 🧩 Cas 2 : RECRUTEUR → charger les candidats associés à ses offres
    if (this.isRecruteur && email) {
      this.talentService.getRecruteurIdByEmail(email).subscribe({
        next: (recruteurId) => {
          this.talentService.getCandidatsByRecruteur(recruteurId).subscribe({
            next: (candidats) => {
              this.candidats = candidats;
              this.filteredCandidats = candidats; // <-- utile pour afficher initialement tous les résultats
              this.isLoading = false;
            },
            error: (err) => {
              console.error('Erreur chargement candidats (recruteur) :', err);
              this.isLoading = false;
            }
          });
        },
        error: (err) => {
          console.error('Erreur récupération ID recruteur :', err);
          this.isLoading = false;
        }
      });
      return;
    }

    // 🧩 Cas 3 : autres rôles → rien à afficher
    this.candidats = [];
    this.isLoading = false;
  }

  deleteCandidat(id: number): void {
    if (confirm("Voulez-vous vraiment supprimer ce candidat ?")) {
      this.talentService.deleteCandidat(id).subscribe(() => {
        this.candidats = this.candidats.filter(c => c.id !== id);
      });
    }
  }

  applyFilter(): void {
  const keyword = this.searchKeyword.toLowerCase().trim();

  this.filteredCandidats = this.candidats.filter(c =>
    (c.nom?.toLowerCase().includes(keyword) ?? false) ||
    (c.prenom?.toLowerCase().includes(keyword) ?? false) ||
    (c.email?.toLowerCase().includes(keyword) ?? false)
  );
}

}
