import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TalentService, OffreDTO } from '../../services/talent.service';

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

  constructor(private talentService: TalentService, private router: Router) {}

  ngOnInit(): void {
    this.loadOffres();
  }

  loadOffres(): void {
    this.talentService.getOffres().subscribe({
      next: (data) => {
        this.offres = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Erreur lors du chargement des offres : ', err);
        this.isLoading = false;
      }
    });
  }

  viewOffre(id: number): void {
    this.router.navigate(['/offres', id]);
  }

  deleteOffre(id: number): void {
    if (confirm('Voulez-vous vraiment supprimer cette offre ?')) {
      this.talentService.deleteOffre(id).subscribe(() => {
        this.offres = this.offres.filter(o => o.id !== id);
      });
    }
  }
}
