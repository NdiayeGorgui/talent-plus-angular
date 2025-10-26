import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EmployeurDTO, TalentService } from '../../services/talent.service';


@Component({
  selector: 'app-employeur-list',
  standalone: false,
  templateUrl: './employeur-list.component.html',
  styleUrls: ['./employeur-list.component.css']
})
export class EmployeurListComponent implements OnInit {

  employeurs: EmployeurDTO[] = [];
  filteredEmployeurs: EmployeurDTO[] = [];
  displayedColumns: string[] = [
    'id', 'nom', 'typeEntreprise', 'emailContact', 'telephone', 'ville', 'pays', 'actions'
  ];
  isLoading = true;
  searchKeyword = '';

  constructor(private talentService: TalentService, private router: Router) {}

  ngOnInit(): void {
    this.loadEmployeurs();
  }

  loadEmployeurs(): void {
    this.talentService.getEmployeurs().subscribe({
      next: (data) => {
        this.employeurs = data;
        this.filteredEmployeurs = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Erreur lors du chargement des employeurs', err);
        this.isLoading = false;
      }
    });
  }

  applyFilter(): void {
    const keyword = this.searchKeyword.toLowerCase().trim();
    this.filteredEmployeurs = this.employeurs.filter(
      e =>
        e.nom?.toLowerCase().includes(keyword) ||
        e.emailContact?.toLowerCase().includes(keyword) ||
        e.ville?.toLowerCase().includes(keyword) ||
        e.pays?.toLowerCase().includes(keyword)
    );
  }

  clearSearch(): void {
    this.searchKeyword = '';
    this.filteredEmployeurs = [...this.employeurs];
  }

  editEmployeur(id: number): void {
    this.router.navigate(['/employeurs/edit', id]);
  }

  deleteEmployeur(id: number): void {
    if (confirm('Voulez-vous vraiment supprimer cet employeur ?')) {
      this.talentService.deleteEmployeur(id).subscribe({
        next: () => {
          alert('✅ Employeur supprimé avec succès.');
          this.loadEmployeurs();
        },
        error: (err) => {
          console.error('Erreur lors de la suppression', err);
          alert('❌ Impossible de supprimer cet employeur.');
        }
      });
    }
  }
}
