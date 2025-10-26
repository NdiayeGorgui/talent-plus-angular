import { Component, OnInit } from '@angular/core';
import { ProcessusDTO, TalentService } from '../../services/talent.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-mes-applications',
  standalone: false,
  templateUrl: './mes-applications.component.html',
  styleUrl: './mes-applications.component.css'
})
export class MesApplicationsComponent implements OnInit {
  processusList: ProcessusDTO[] = [];
  loading = false;

  constructor(
    private talentService: TalentService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    console.log("🟡 MesApplicationsComponent initialisé");

    const email = this.authService.getCurrentUserEmail();
    console.log("📧 Email utilisateur extrait du token :", email);

    if (!email) {
      console.warn("⚠️ Aucun email trouvé dans le token.");
      return;
    }

    this.loading = true;

    // 🔁 Étape 1 : récupérer le vrai candidatId à partir de son email
    this.talentService.getCandidatByEmail(email).subscribe({
      next: (candidat) => {
        console.log("✅ Candidat trouvé :", candidat);

        // 🔁 Étape 2 : charger les candidatures de ce candidat
        this.talentService.getProcessusByCandidat(candidat.id).subscribe({
          next: (data) => {
            console.log("✅ Données processus reçues :", data);
            this.processusList = data;
            this.loading = false;
          },
          error: (err) => {
            console.error("❌ Erreur chargement processus", err);
            this.loading = false;
          }
        });
      },
      error: (err) => {
        console.error("❌ Erreur récupération candidat par email :", err);
        this.loading = false;
      }
    });
  }

  ouvrirOffre(offreId: number): void {
    window.open(`/offres/${offreId}`, '_blank');
  }
}
