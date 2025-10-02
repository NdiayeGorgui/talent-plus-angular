import { Component, OnInit } from '@angular/core';
import { RecruteurDTO, TalentService } from '../../services/talent.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-recruteur-detail',
  standalone: false,
  templateUrl: './recruteur-detail.component.html',
  styleUrl: './recruteur-detail.component.css'
})
export class RecruteurDetailComponent implements OnInit {
  recruteurForm!: FormGroup;
  recruteurId!: number;
  loading = false;
  niveaux: string[] = ['JUNIOR', 'INTERMEDIAIRE', 'SENIOR'];

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private talentService: TalentService,
    private snackBar: MatSnackBar,
    public router: Router
  ) {}

  ngOnInit(): void {
    this.recruteurId = Number(this.route.snapshot.paramMap.get('id'));

    this.recruteurForm = this.fb.group({
      nom: ['', Validators.required],
      prenom: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      telephone: ['', Validators.required],
      poste: [''],
      niveau: ['', Validators.required]
    });

    this.loadRecruteur();
  }

  loadRecruteur(): void {
    this.talentService.getRecruteurById(this.recruteurId).subscribe({
      next: (recruteur: RecruteurDTO) => {
        this.recruteurForm.patchValue(recruteur);
      },
      error: () => {
        this.snackBar.open('❌ Impossible de charger le recruteur', 'Fermer', { duration: 3000 });
        this.router.navigate(['/recruteurs']);
      }
    });
  }

  onUpdate(): void {
    if (this.recruteurForm.invalid) {
      this.snackBar.open('⚠️ Veuillez remplir tous les champs requis', 'Fermer', { duration: 3000 });
      return;
    }

    this.loading = true;
    const updatedRecruteur: RecruteurDTO = this.recruteurForm.value;

    this.talentService.updateRecruteur(this.recruteurId, updatedRecruteur).subscribe({
      next: () => {
        this.snackBar.open('✅ Recruteur modifié avec succès', 'Fermer', { duration: 3000 });
        this.router.navigate(['/recruteurs']);
      },
      error: () => {
        this.snackBar.open('❌ Erreur lors de la mise à jour', 'Fermer', { duration: 3000 });
        this.loading = false;
      }
    });
  }
}
