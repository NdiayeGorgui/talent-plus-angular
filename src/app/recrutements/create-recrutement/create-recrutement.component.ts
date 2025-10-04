import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { OffreDTO, TalentService } from '../../services/talent.service';

@Component({
  selector: 'app-create-recrutement',
  standalone: false,
  templateUrl: './create-recrutement.component.html',
  styleUrl: './create-recrutement.component.css'
})
export class CreateRecrutementComponent implements OnInit {

  processusId!: number;
  offres: OffreDTO[] = [];
  selectedOffreId!: number;

  constructor(
    private route: ActivatedRoute,
    private talentService: TalentService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Récupérer processusId depuis l'URL
    this.processusId = +this.route.snapshot.paramMap.get('processusId')!;

    // Charger la liste des offres
    this.talentService.getOffres().subscribe({
      next: (data) => this.offres = data,
      error: (err) => console.error('Erreur chargement des offres', err)
    });
  }

  lierOffre() {
    if (!this.selectedOffreId) return;

    this.talentService.lierCandidatureSpontanee(this.processusId, this.selectedOffreId).subscribe({
      next: () => {
        alert('✅ Processus lié avec succès !');
        this.router.navigate(['/recrutements']); // ou autre redirection
      },
      error: (err) => {
        console.error('Erreur lors du lien', err);
        alert('❌ Erreur lors du lien');
      }
    });
  }
}
