import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RecruteurDTO, TalentService } from '../../services/talent.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { SnakBarComponent } from '../../shared/snak-bar/snak-bar.component';

@Component({
  selector: 'app-create-recruteur',
  standalone: false,
  templateUrl: './create-recruteur.component.html',
  styleUrls: ['./create-recruteur.component.css']
})
export class CreateRecruteurComponent implements OnInit {
  recruteurForm!: FormGroup;
  loading = false;
  niveaux: string[] = ['JUNIOR', 'INTERMEDIAIRE', 'SENIOR'];

  constructor(
    private fb: FormBuilder,
    private talentService: TalentService,
    private snackBar: MatSnackBar, // ✅ on garde MatSnackBar pour ouvrir ton composant custom
    public router: Router
  ) {}

  ngOnInit(): void {
    this.recruteurForm = this.fb.group({
      nom: ['', Validators.required],
      prenom: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      telephone: ['', Validators.required],
      poste: [''],
      niveau: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.recruteurForm.invalid) {
      this.openSnack('⚠️ Veuillez remplir tous les champs obligatoires', 'error');
      return;
    }

    this.loading = true;
    const recruteur: RecruteurDTO = this.recruteurForm.value;

    this.talentService.createRecruteur(recruteur).subscribe({
      next: () => {
        this.loading = false;
        this.openSnack('✅ Recruteur créé avec succès', 'success');
        this.router.navigate(['/recruteurs']);
      },
      error: (err) => {
        console.error('Erreur création recruteur', err);
        this.loading = false;
        this.openSnack('❌ Erreur lors de la création du recruteur', 'error');
      }
    });
  }

  /** ✅ Utilise ton composant SnakBar personnalisé */
  openSnack(message: string, type: 'success' | 'error') {
    this.snackBar.openFromComponent(SnakBarComponent, {
      data: { message, type },
      duration: 4000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
      panelClass: type === 'success' ? ['snackbar-success'] : ['snackbar-error']
    });
  }
}
