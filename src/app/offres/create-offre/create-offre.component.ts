import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { TalentService, OffreDTO, RecruteurDTO } from '../../services/talent.service';

@Component({
  selector: 'app-create-offre',
  standalone: false,
  templateUrl: './create-offre.component.html',
  styleUrls: ['./create-offre.component.css']
})
export class CreateOffreComponent implements OnInit {

  offreForm!: FormGroup;
  isSubmitting = false;
  recruteurs: RecruteurDTO[] = []; // Liste des recruteurs

  constructor(
    private fb: FormBuilder,
    private talentService: TalentService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.offreForm = this.fb.group({
      titre: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      categorie: ['', [Validators.required, Validators.minLength(2)]],
      ville: ['', [Validators.required, Validators.minLength(2)]],
      pays: ['', [Validators.required, Validators.minLength(2)]],
      active: [true, Validators.required],
      recruteurId: ['', Validators.required]
    });

    // Charger les recruteurs pour la liste déroulante
    this.talentService.getRecruteurs().subscribe({
      next: (data) => {
        this.recruteurs = data;
      },
      error: (err) => {
        console.error('Erreur lors du chargement des recruteurs', err);
      }
    });
  }

  onSubmit(): void {
    if (this.offreForm.invalid) {
      this.snackBar.open('⚠️ Veuillez remplir correctement le formulaire', 'Fermer', {
        duration: 3000
      });
      return;
    }

    this.isSubmitting = true;

    const newOffre: OffreDTO = {
      ...this.offreForm.value,
      datePublication: new Date().toISOString() // auto-ajout de la date
    };

    this.talentService.createOffre(newOffre).subscribe({
      next: () => {
        this.snackBar.open('✅ Offre créée avec succès', 'Fermer', { duration: 3000 });
        this.router.navigate(['/offres']); // redirection vers la liste des offres
      },
      error: (err) => {
        console.error(err);
        this.snackBar.open('❌ Erreur lors de la création de l\'offre', 'Fermer', { duration: 3000 });
      },
      complete: () => this.isSubmitting = false
    });
  }
}
