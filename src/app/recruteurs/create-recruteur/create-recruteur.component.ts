import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RecruteurDTO, TalentService } from '../../services/talent.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-recruteur',
  standalone: false,
  templateUrl: './create-recruteur.component.html',
  styleUrl: './create-recruteur.component.css'
})
export class CreateRecruteurComponent implements OnInit {
  recruteurForm!: FormGroup;
  loading = false;
  niveaux: string[] = ['JUNIOR', 'INTERMEDIAIRE', 'SENIOR'];

  constructor(
    private fb: FormBuilder,
    private talentService: TalentService,
    private snackBar: MatSnackBar,
    public router: Router
  ) { }

  ngOnInit(): void {
    this.recruteurForm = this.fb.group({
      nom: ['', Validators.required],
      prenom: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      telephone: ['', Validators.required],
      poste: [''],
      niveau: ['', Validators.required] // ✅ Ici c'est bien un tableau : [valeur initiale, validateurs]
    });

  }

  onSubmit(): void {
    if (this.recruteurForm.invalid) {
      this.snackBar.open('⚠️ Veuillez remplir tous les champs obligatoires', 'Fermer', { duration: 3000 });
      return;
    }

    this.loading = true;
    const recruteur: RecruteurDTO = this.recruteurForm.value;

    this.talentService.createRecruteur(recruteur).subscribe({
      next: () => {
        this.snackBar.open('✅ Recruteur créé avec succès', 'Fermer', { duration: 3000 });
        this.router.navigate(['/recruteurs']); // redirection vers la liste
      },
      error: () => {
        this.snackBar.open('❌ Erreur lors de la création du recruteur', 'Fermer', { duration: 3000 });
        this.loading = false;
      }
    });
  }
}
