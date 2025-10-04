import { Component, OnInit } from '@angular/core';
import { MetadonneeRHDTO, TalentService } from '../../services/talent.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-candidature-spontanee',
  standalone: false,
  templateUrl: './candidature-spontanee.component.html',
  styleUrl: './candidature-spontanee.component.css'
})
export class CandidatureSpontaneeComponent implements OnInit {
  candidatures: MetadonneeRHDTO[] = [];
  isLoading = true;
  displayedColumns: string[] = ['id', 'nom', 'prenom', 'email', 'telephone', 'domaine', 'typeContrat', 'localisation', 'actions'];

  constructor(private talentService: TalentService,  private router: Router) {}

  ngOnInit(): void {
    this.talentService.getMetadonneesRH().subscribe({
      next: (data: MetadonneeRHDTO[]) => {
        this.candidatures = data.filter(c => c.source === 'Candidature Spontanée');
        this.isLoading = false;
      },
      error: err => {
        console.error('Erreur chargement candidatures spontanées:', err);
        this.isLoading = false;
      }
    });
  }

  voirDetails(id: number) {
    // Ex: naviguer ou afficher les détails
    console.log('Voir détails pour', id);
  }

  supprimer(id: number) {
    // TODO: appeler service de suppression si nécessaire
    console.log('Supprimer', id);
  }

    goToWizard(): void {
    
      this.router.navigate(['/candidature/postuler']);
    
  }
}
