import { Component, OnInit } from '@angular/core';
import { RecruteurDTO, TalentService } from '../../services/talent.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnakBarComponent } from '../../shared/snak-bar/snak-bar.component';

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
      error: (err) => {
        const message = err?.error?.message || '❌ Impossible de charger le recruteur';
        this.snackBar.openFromComponent(SnakBarComponent, {
          data: { message, type: 'error' },
          duration: 3000
        });
        this.router.navigate(['/recruteurs']);
      }
    });
  }

  onUpdate(): void {
    if (this.recruteurForm.invalid) {
      this.snackBar.openFromComponent(SnakBarComponent, {
        data: { message: '⚠️ Veuillez remplir tous les champs requis', type: 'error' },
        duration: 3000
      });
      return;
    }

    this.loading = true;
    const updatedRecruteur: RecruteurDTO = this.recruteurForm.value;

    this.talentService.updateRecruteur(this.recruteurId, updatedRecruteur).subscribe({
      next: (res: any) => {
        const message = res?.message || '✅ Recruteur modifié avec succès';
        this.snackBar.openFromComponent(SnakBarComponent, {
          data: { message, type: 'success' },
          duration: 3000,
          horizontalPosition: 'center',
          verticalPosition: 'top',
      
        });
        this.router.navigate(['/recruteurs']);
      },
      error: (err) => {
        const message = err?.error?.message || '❌ Erreur lors de la mise à jour du recruteur';
        this.snackBar.openFromComponent(SnakBarComponent, {
          data: { message, type: 'error' },
          duration: 3000
        });
        this.loading = false;
      }
    });
  }
}
