import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TalentService, CandidatDTO, CandidatResponseDTO, CompetenceLingustiqueDTO } from '../../services/talent.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-candidat-detail',
  standalone: false,
  templateUrl: './candidat-detail.component.html',
  styleUrls: ['./candidat-detail.component.css']
})
export class CandidatDetailComponent implements OnInit {
  competencesLinguistiques: CompetenceLingustiqueDTO[] = [];

  candidat?: CandidatResponseDTO;
  isLoading = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private talentService: TalentService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (!id) {
      this.snackBar.open("❌ ID invalide", "Fermer", { duration: 3000 });
      this.router.navigate(['/candidats']);
      return;
    }

    this.talentService.getCandidatById(id).subscribe({
      next: (data) => {
        this.candidat = data;
        this.talentService.getCompetencesLinguistiques(data.id!).subscribe({
          next: (linguistiques) => {
            this.competencesLinguistiques = linguistiques;
          },
          error: (err) => {
            console.error('❌ Erreur chargement compétences linguistiques', err);
          }
        });

        this.isLoading = false;
      },
      error: () => {
        this.snackBar.open("❌ Candidat introuvable", "Fermer", { duration: 3000 });
        this.isLoading = false;
        this.router.navigate(['/candidats']);
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/candidats']);
  }

  mapNiveau(niveau: string): string {
    switch (niveau) {
      case 'DEBUTANT': return 'Débutant';
      case 'INTERMEDIAIRE': return 'Intermédiaire';
      case 'EXPERT': return 'Expert';
      default: return niveau;
    }
  }


  getFileUrl(type: 'cv' | 'lettre', id: number): string {
    return `${location.origin}/api/files/${type}/${id}`;
  }

  downloadCv(cvId: number, titre: string): void {
    this.talentService.downloadCv(cvId).subscribe({
      next: (response) => {
        const blob = response.body;
        if (!blob) return;

        let fileName = titre || `cv_${cvId}`;

        // 👇 maintenant Angular pourra lire le header
        const contentDisposition = response.headers.get('Content-Disposition');
        if (contentDisposition) {
          const match = /filename="([^"]+)"/i.exec(contentDisposition);
          if (match?.[1]) {
            fileName = match[1];
          }
        }

        // fallback si jamais pas d’extension
        if (!/\.[a-zA-Z0-9]+$/.test(fileName)) {
          const contentType = response.headers.get('Content-Type') || blob.type;
          if (contentType.includes('pdf')) fileName += '.pdf';
          else if (contentType.includes('wordprocessingml')) fileName += '.docx';
        }

        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        a.click();
        window.URL.revokeObjectURL(url);
      }
    });
  }

downloadLettre(lettreId: number, titre: string): void {
  this.talentService.downloadLettre(lettreId).subscribe({
    next: (response) => {
      const blob = response.body;
      if (!blob) {
        this.snackBar.open("❌ Fichier de la lettre vide", "Fermer", { duration: 3000 });
        return;
      }

      let fileName = titre || `lettre_${lettreId}`;

      // Extraire le nom du fichier à partir du header Content-Disposition
      const contentDisposition = response.headers.get('Content-Disposition');
      if (contentDisposition) {
        const match = /filename="([^"]+)"/i.exec(contentDisposition);
        if (match?.[1]) {
          fileName = match[1];
        }
      }

      // Ajouter une extension si nécessaire
      if (!/\.[a-zA-Z0-9]+$/.test(fileName)) {
        const contentType = response.headers.get('Content-Type') || blob.type;
        if (contentType.includes('pdf')) fileName += '.pdf';
        else if (contentType.includes('wordprocessingml')) fileName += '.docx';
        else if (contentType.includes('text/plain')) fileName += '.txt';
      }

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      a.click();
      window.URL.revokeObjectURL(url);
    },
    error: () => {
      this.snackBar.open("❌ Impossible de télécharger la lettre", "Fermer", { duration: 3000 });
    }
  });
}




}