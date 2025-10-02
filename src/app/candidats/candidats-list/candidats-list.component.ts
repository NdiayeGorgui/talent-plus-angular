import { Component, OnInit } from '@angular/core';
import { TalentService, CandidatDTO } from '../../services/talent.service';

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

  constructor(private talentService: TalentService) {}

  ngOnInit(): void {
    this.loadCandidats();
  }

  loadCandidats(): void {
    this.talentService.getCandidats().subscribe({
      next: (data) => {
        this.candidats = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Erreur lors du chargement des candidats : ', err);
        this.isLoading = false;
      }
    });
  }

  deleteCandidat(id: number): void {
    if (confirm("Voulez-vous vraiment supprimer ce candidat ?")) {
      this.talentService.deleteCandidat(id).subscribe(() => {
        this.candidats = this.candidats.filter(c => c.id !== id);
      });
    }
  }
}
