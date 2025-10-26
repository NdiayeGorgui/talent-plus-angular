import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { EmployeurDTO, TalentService } from '../../services/talent.service';


@Component({
  selector: 'app-employeur-details',
  standalone: false,
  templateUrl: './employeur-details.component.html',
  styleUrls: ['./employeur-details.component.css']
})
export class EmployeurDetailsComponent implements OnInit {
  employeur?: EmployeurDTO;
  isEditing = false;
  isLoading = true;
  editForm!: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private talentService: TalentService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.loadEmployeur(id);
  }

  loadEmployeur(id: number): void {
    this.talentService.getEmployeurById(id).subscribe({
      next: (data) => {
        this.employeur = data;
        this.isLoading = false;
        this.initForm(data);
      },
      error: (err) => {
        console.error('Erreur chargement employeur', err);
        this.isLoading = false;
      }
    });
  }

  initForm(employeur: EmployeurDTO): void {
    this.editForm = this.fb.group({
      nom: [employeur.nom],
      typeEntreprise: [employeur.typeEntreprise],
      emailContact: [employeur.emailContact],
      telephone: [employeur.telephone],
      poste: [employeur.poste],
      adresse: [employeur.adresse],
      ville: [employeur.ville],
      pays: [employeur.pays]
    });
  }

  enableEdit(): void {
    this.isEditing = true;
  }

  cancelEdit(): void {
    this.isEditing = false;
    if (this.employeur) this.initForm(this.employeur); // reset form
  }

  saveChanges(): void {
    if (!this.employeur?.id) return;

    const updatedEmployeur: EmployeurDTO = {
      ...this.employeur,
      ...this.editForm.value
    };

    this.talentService.updateEmployeur(this.employeur.id, updatedEmployeur).subscribe({
      next: (data) => {
        this.employeur = data;
        this.isEditing = false;
        alert('✅ Informations mises à jour avec succès !');
      },
      error: (err) => {
        console.error('Erreur mise à jour', err);
        alert('❌ Échec de la mise à jour.');
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/employeurs']);
  }
}
