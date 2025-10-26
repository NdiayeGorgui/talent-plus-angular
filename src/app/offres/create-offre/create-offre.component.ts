import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { TalentService, OffreDTO, RecruteurDTO, EmployeurDTO } from '../../services/talent.service';
import { AuthService } from '../../services/auth.service';
import { SnakBarComponent } from '../../shared/snak-bar/snak-bar.component';

@Component({
  selector: 'app-create-offre',
  standalone: false,
  templateUrl: './create-offre.component.html',
  styleUrls: ['./create-offre.component.css']
})
export class CreateOffreComponent implements OnInit {

  offreForm!: FormGroup;
  isSubmitting = false;
  recruteurs: RecruteurDTO[] = [];
  employeurs: EmployeurDTO[] = [];
  isAdmin = false;
  isEmployeur = false;
  currentRecruteurId?: number;
  currentEmployeurId?: number;
  employeurName: string = ''; // 👈 pour afficher le nom

  quillModules = {
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'],
      ['blockquote', 'code-block'],
      [{ 'header': 1 }, { 'header': 2 }],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      [{ 'script': 'sub' }, { 'script': 'super' }],
      [{ 'indent': '-1' }, { 'indent': '+1' }],
      [{ 'direction': 'rtl' }],
      [{ 'size': ['small', false, 'large', 'huge'] }],
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      [{ 'color': [] }, { 'background': [] }],
      [{ 'font': [] }],
      [{ 'align': [] }],
      ['clean'],
      ['link']
    ]
  };

  constructor(
    private fb: FormBuilder,
    private talentService: TalentService,
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {}

  ngOnInit(): void {
    const roles = this.authService.getUserRoles();
    this.isAdmin = roles.includes('ROLE_ADMIN');
    this.isEmployeur = roles.includes('ROLE_EMPLOYEUR');

    // ✅ Construire le formulaire
    this.offreForm = this.fb.group({
      titre: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      categorie: ['', [Validators.required, Validators.minLength(2)]],
      ville: ['', [Validators.required, Validators.minLength(2)]],
      pays: ['', [Validators.required, Validators.minLength(2)]],
      active: [this.isAdmin ? true : false],
      recruteurId: [null],
      employeurId: [null],
      dateFinAffichage: ['', Validators.required]
    });

    // ✅ Si ADMIN → rendre les IDs requis et charger les listes
    if (this.isAdmin) {
      this.offreForm.get('recruteurId')?.setValidators([Validators.required]);
      this.offreForm.get('employeurId')?.setValidators([Validators.required]);
      this.loadRecruteurs();
      this.loadEmployeurs();
    }

    // ✅ Si RECRUTEUR connecté → remplir automatiquement son ID
    if (roles.includes('ROLE_RECRUTEUR')) {
      const email = this.authService.getCurrentUserEmail();
      if (email) {
        this.talentService.getRecruteurIdByEmail(email).subscribe({
          next: (id) => {
            this.currentRecruteurId = id;
            this.offreForm.patchValue({ recruteurId: id });
          },
          error: (err) => console.error('Erreur récupération recruteur connecté', err)
        });
      }
    }

    // ✅ Si EMPLOYEUR connecté → remplir employeurId et afficher son nom
    if (this.isEmployeur) {
      const email = this.authService.getCurrentUserEmail();
      if (email) {
        // 1️⃣ Récupérer l’ID
        this.talentService.getEmployeurIdByEmail(email).subscribe({
          next: (id) => {
            this.currentEmployeurId = id;
            this.offreForm.patchValue({
              employeurId: id,
              active: false
            });
            this.offreForm.get('employeurId')?.disable();

            // 2️⃣ Récupérer le nom de l’employeur
            this.talentService.getEmployeurByEmail(email).subscribe({
              next: (employeur) => {
                this.employeurName = employeur.nom;
              },
              error: (err) => console.error('Erreur récupération nom employeur', err)
            });
          },
          error: (err) => console.error('Erreur récupération employeur connecté', err)
        });
      }
    }

    this.offreForm.updateValueAndValidity();
  }

  private loadRecruteurs(): void {
    this.talentService.getRecruteurs().subscribe({
      next: (data) => (this.recruteurs = data),
      error: (err) => console.error('Erreur chargement recruteurs', err)
    });
  }

  private loadEmployeurs(): void {
    this.talentService.getEmployeurs().subscribe({
      next: (data) => (this.employeurs = data),
      error: (err) => console.error('Erreur chargement employeurs', err)
    });
  }

  private formatDate(date: Date): string {
    return date ? new Date(date).toISOString() : '';
  }

  onSubmit(): void {
    if (this.offreForm.invalid) {
      this.openSnack('⚠️ Veuillez remplir correctement le formulaire.', 'error');
      return;
    }

    this.isSubmitting = true;

    const newOffre: OffreDTO = {
      ...this.offreForm.getRawValue(),
      datePublication: new Date().toISOString(),
      employeurId: this.currentEmployeurId ?? this.offreForm.value.employeurId,
      recruteurId: this.currentRecruteurId ?? this.offreForm.value.recruteurId
    };

    this.talentService.createOffre(newOffre).subscribe({
      next: () => {
        this.openSnack('✅ Offre créée avec succès', 'success');
        this.router.navigate(['/offres']);
      },
      error: (err) => {
        console.error('Erreur création offre', err);
        this.openSnack('❌ Erreur lors de la création de l\'offre', 'error');
      },
      complete: () => (this.isSubmitting = false)
    });
  }

  /** ✅ Méthode utilitaire pour ton snackbar personnalisé */
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
