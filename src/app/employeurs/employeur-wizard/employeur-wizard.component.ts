import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TalentService, EmployeurDTO, OffreDTO } from '../../services/talent.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnakBarComponent } from '../../shared/snak-bar/snak-bar.component';

@Component({
  selector: 'app-employeur-wizard',
  standalone: false,
  templateUrl: './employeur-wizard.component.html',
  styleUrls: ['./employeur-wizard.component.css']
})
export class EmployeurWizardComponent implements OnInit {

  employeurForm!: FormGroup;
  offreForm!: FormGroup;
  isSubmitting = false;
  recruteurAdminEmail = 'adminrecruteur@talentplus.com';

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
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.employeurForm = this.fb.group({
      nom: ['', Validators.required],
      typeEntreprise: ['', Validators.required],
      emailContact: ['', [Validators.required, Validators.email]],
      telephone: ['', Validators.required],
      poste: ['', Validators.required],
      adresse: ['', Validators.required],
      ville: ['', Validators.required],
      pays: ['', Validators.required],
    });

    this.offreForm = this.fb.group({
      titre: ['', Validators.required],
      description: ['', Validators.required],
      categorie: ['', Validators.required],
      ville: ['', Validators.required],
      pays: ['', Validators.required],
      dateFinAffichage: ['', Validators.required]
    });
  }

  /**
   * Soumission du formulaire
   */
  soumettre(): void {
    if (this.employeurForm.invalid || this.offreForm.invalid) {
      this.openSnack('⚠️ Veuillez remplir toutes les informations nécessaires.', 'error');
      return;
    }

    this.isSubmitting = true;

    const employeur: EmployeurDTO = this.employeurForm.value;

    // 1️⃣ Créer l’employeur
    this.talentService.createEmployeur(employeur).subscribe({
      next: (createdEmployeur) => {
        console.log('✅ Employeur créé :', createdEmployeur);

        // 2️⃣ Récupérer l’ID du recruteur admin par email
        this.talentService.getRecruteurIdByEmail(this.recruteurAdminEmail).subscribe({
          next: (recruteurId) => {
            console.log('✅ Recruteur admin ID :', recruteurId);

            // 3️⃣ Créer l’offre avec recruteur par défaut et employeur lié
            const offre: OffreDTO = {
              ...this.offreForm.value,
              recruteurId: recruteurId,
              employeurId: (createdEmployeur as any).id,
              datePublication: new Date().toISOString(),
              active: false // par défaut, l’offre n’est pas active
            };

            this.talentService.createOffre(offre).subscribe({
              next: () => {
                this.openSnack('✅ Employeur et offre créés avec succès', 'success');
                this.router.navigate(['/offres']);
              },
              error: (err) => {
                console.error('❌ Erreur création offre:', err);
                this.openSnack('❌ Erreur lors de la création du de l\'offre.', 'error');
              },
              complete: () => this.isSubmitting = false
            });
          },
          error: (err) => {
            console.error('❌ Erreur récupération recruteur admin:', err);
            this.openSnack('❌ Impossible de récupérer le recruteur par défaut.', 'error');
            this.isSubmitting = false;
          }
        });
      },
      error: (err) => {
        console.error('❌ Erreur création employeur:', err);
        this.openSnack('❌ Erreur lors de la création de l\'employeur.', 'error');
        this.isSubmitting = false;
      }
    });
  }

  /** ✅ Méthode utilitaire pour afficher ton SnakBarComponent personnalisé */
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
