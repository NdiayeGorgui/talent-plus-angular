import { Component, OnInit } from '@angular/core';
import { TalentService, RecruteurDTO } from '../../services/talent.service';

@Component({
  selector: 'app-recruteurs-list',
  standalone: false,
  templateUrl: './recruteurs-list.component.html',
  styleUrls: ['./recruteurs-list.component.css']
})
export class RecruteursListComponent implements OnInit {

  recruteurs: RecruteurDTO[] = [];
  displayedColumns: string[] = ['id', 'nom', 'email', 'actions'];
  isLoading = true;

  constructor(private talentService: TalentService) {}

  ngOnInit(): void {
    this.loadRecruteurs();
  }

  loadRecruteurs(): void {
    this.talentService.getRecruteurs().subscribe({
      next: (data) => {
        this.recruteurs = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Erreur lors du chargement des recruteurs : ', err);
        this.isLoading = false;
      }
    });
  }

 deleteRecruteur(id: number): void {
  if (confirm("Voulez-vous vraiment supprimer ce recruteur ?")) {
    this.talentService.deleteRecruteur(id).subscribe({
      next: () => {
        alert("✅ Recruteur supprimé avec succès");
        this.loadRecruteurs(); // recharger la liste après suppression
      },
      error: (err) => {
        console.error(err);
        alert("❌ Erreur lors de la suppression du recruteur");
      }
    });
  }
}

}
