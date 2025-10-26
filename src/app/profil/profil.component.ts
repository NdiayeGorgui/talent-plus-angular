import { Component, OnInit } from '@angular/core';
import { MetadonneeRHDTO, TalentService, UserProfileDTO } from '../services/talent.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../services/auth.service';
import { SnakBarComponent } from '../shared/snak-bar/snak-bar.component';

@Component({
  selector: 'app-profil',
  standalone: false,
  templateUrl: './profil.component.html',
  styleUrl: './profil.component.css'
})
export class ProfilComponent implements OnInit {
  user?: UserProfileDTO;
  error?: string;
  recruteurForm: FormGroup;
  loading = false;
  editMode = false;
  candidatForm!: FormGroup;
  editForm!: FormGroup;
  addExperienceForm!: FormGroup;
  editMetadonneeRhForm!: FormGroup;
  talent: any;
  editMetadonneeRh: boolean = false;

  adminForm!: FormGroup;
  addCompetenceForm!: FormGroup;
  replaceCvId: number | null = null;
  replaceLettreId: number | null = null;

  originalLinguistique: any[] = [];
  editLinguistique: boolean = false;

  niveaux = ['DEBUTANT', 'INTERMEDIAIRE', 'EXPERT'];

  domaineRechercheOptions = ['IT', 'BANQUE', 'FINANCE', 'MARKETING', 'AUTRE'];
  typeContratOptions = ['CDI', 'CDD', 'ALTERNANCE', 'STAGE'];
  disponibiliteOptions = ['IMMEDIATE', 'UN_MOIS', 'TROIS_MOIS'];
  sourceOptions = ['CANDIDATURE_DIRECT', 'RECOMMANDATION', 'SITE_CARRIERE', 'LINKEDIN', 'INDEED', 'JOBBOOM', 'JOBILLICO', 'EMPLOI_QUEBEC', 'AUTRE'];



  initEditRhForm(): void {
    this.editMetadonneeRhForm = this.fb.group({
      domaineRecherche: [this.user?.metadonneeRH?.domaineRecherche || '', Validators.required],
      typeContrat: [this.user?.metadonneeRH?.typeContrat || '', Validators.required],
      localisation: [this.user?.metadonneeRH?.localisation || '', Validators.required],
      disponibilite: [this.user?.metadonneeRH?.disponibilite || '', Validators.required],
      pretentionsSalariales: [this.user?.metadonneeRH?.pretentionsSalariales || '', [Validators.required, Validators.min(0)]],
      source: [this.user?.metadonneeRH?.source || '', Validators.required]
    });

  }



  constructor(
    private talentService: TalentService,
    private authService: AuthService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar
  ) {
    this.recruteurForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  get isCandidat(): boolean {
    return this.user?.role === 'CANDIDAT';
  }
  get isRecruteur(): boolean {
    return this.user?.role === 'RECRUTEUR';
  }
  get isEmployeur(): boolean {
    return this.user?.role === 'EMPLOYEUR';
  }
  get isAdmin(): boolean {
    return this.user?.role === 'ADMIN';
  }

  ngOnInit(): void {
    this.editForm = this.fb.group({}); // Init vide, on le remplit après
    this.addCompetenceForm = this.fb.group({
      libelle: ['', Validators.required],
      niveau: ['DEBUTANT', Validators.required],
    });

    this.addExperienceForm = this.fb.group({
      poste: ['', Validators.required],
      entreprise: ['', Validators.required],
      dateDebut: ['', Validators.required],
      dateFin: [''],
      description: ['']
    });

    console.log("Appel getMyProfile pour récupérer le profil...");
    this.talentService.getMyProfile().subscribe({
      next: (u) => {
        console.log("Profil reçu :", u);
        console.log("ID utilisateur reçu :", u.id);  // <-- Ici
        this.user = u;

        if (this.isCandidat) {
          console.log("Utilisateur est candidat");
          this.editForm = this.fb.group({
            nom: [u.nom, Validators.required],
            prenom: [u.prenom, Validators.required],
            email: [{ value: u.email, disabled: true }],
            telephone: [u.telephone],
            adresse: [u.adresse],
            dateNaissance: [u.dateNaissance],
            niveauEtude: [u.niveauEtude]

          });
        } else if (this.isRecruteur) {
          console.log("Utilisateur est recruteur");
          this.editForm = this.fb.group({
            nom: [u.nom, Validators.required],
            prenom: [u.prenom, Validators.required],
            email: [{ value: u.email, disabled: true }],
            telephone: [u.telephone],
            poste: [u.poste],
            niveau: [u.niveau],
          });
        } else if (this.isEmployeur) {
          console.log("Utilisateur est employeur");
          this.editForm = this.fb.group({
            nom: [u.nom, Validators.required],
            emailContact: [{ value: u.emailContact, disabled: true }],
            telephone: [u.telephone],
            poste: [u.poste],

          });
        } else if (this.isAdmin) {
          console.log("Utilisateur est admin");
          this.editForm = this.fb.group({
            nom: [u.nom, Validators.required],
            prenom: [u.prenom, Validators.required],
            email: [{ value: u.email, disabled: true }],
            telephone: [u.telephone],
            poste: [u.poste],
          });
        } else {
          console.warn("Rôle inconnu :", u.role);
        }
      },
      error: err => {
        console.error('Erreur récupération profil', err);
        this.error = '❌ Impossible de charger le profil.';
        this.openSnack(this.error, 'error');
      }
    });
  }

  creerRecruteur(): void {
    if (this.recruteurForm.invalid) {
      console.warn("Formulaire invalide : ", this.recruteurForm.value);
      return;
    }

    this.loading = true;
    const { username, email, password } = this.recruteurForm.value;

    this.authService.register(username, email, password, 'RECRUTEUR').subscribe({
      next: () => {
        this.loading = false;
        this.openSnack('✅ Recruteur créé avec succès', 'success');

        this.recruteurForm.reset();
      },
      error: (err) => {
        this.loading = false;
        console.error("Erreur création recruteur", err);
        this.openSnack('❌ Erreur lors de la création du recruteur', 'error');
      }
    });
  }

  toggleEdit(): void {
    this.editMode = !this.editMode;

    if (this.editMode && this.user) {
      this.editForm = this.fb.group({}); // Reset avant remplissage

      if (this.isCandidat) {
        this.editForm = this.fb.group({
          nom: [this.user.nom, Validators.required],
          prenom: [this.user.prenom, Validators.required],
          email: [{ value: this.user.email, disabled: true }],
          telephone: [this.user.telephone],
          dateNaissance: [this.user.dateNaissance],
          adresse: [this.user.adresse],
          niveauEtude: [this.user.niveauEtude],
          niveau: [this.user.niveau],
        });
      } else if (this.isRecruteur) {
        this.editForm = this.fb.group({
          nom: [this.user.nom, Validators.required],
          prenom: [this.user.prenom, Validators.required],
          email: [{ value: this.user.email, disabled: true }],
          telephone: [this.user.telephone],
          poste: [this.user.poste],
          niveau: [this.user.niveau],
        });
      } else if (this.isEmployeur) {
        this.editForm = this.fb.group({
          nom: [this.user.nom, Validators.required],
          email: [{ value: this.user.emailContact, disabled: true }],
          telephone: [this.user.telephone],
          poste: [this.user.poste],

        });
      } else if (this.isAdmin) {
        this.editForm = this.fb.group({
          nom: [this.user.nom, Validators.required],
          prenom: [this.user.prenom, Validators.required],
          email: [{ value: this.user.email, disabled: true }],
          telephone: [this.user.telephone],
          poste: [this.user.poste],
        });
      }
    }
  }

  cancelEdit(): void {
    this.editMode = false;
  }

  submitProfileUpdate(): void {
    console.log('submitProfileUpdate appelé');

    if (!this.user?.id) {
      console.warn('submitProfileUpdate: user.id non défini');
      return;
    }

    if (!this.editForm.valid) {
      console.warn('submitProfileUpdate: formulaire invalide', this.editForm.value);
      return;
    }

    const updatedData = this.editForm.getRawValue();
    console.log('Données à envoyer pour mise à jour :', updatedData);

    if (this.isCandidat) {
      this.talentService.updateCandidatProfile(this.user.id, updatedData).subscribe({
        next: (response) => {
          console.log('Réponse updateCandidat:', response);
          this.openSnack('✅ Profil candidat mis à jour', 'success');
          this.editMode = false;
          this.ngOnInit(); // recharger le profil mis à jour
        },
        error: (error) => {
          console.error("Erreur lors de la mise à jour du profil candidat", error);
          this.openSnack(
            "❌ Erreur mise à jour du profil : " + (error.message || error.statusText || "Erreur inconnue"),
            "error"
          );

        }
      });
    } else {
      console.warn('submitProfileUpdate: rôle non candidat, pas de traitement');
    }

    if (this.isRecruteur) {
      this.talentService.updateRecruteurProfile(this.user.id, updatedData).subscribe({
        next: (response) => {
          console.log('Réponse updateRecruteur:', response);
          this.openSnack('✅ Profil recruteur mis à jour', 'success');
          this.editMode = false;
          this.ngOnInit(); // recharger le profil mis à jour
        },
        error: (error) => {
          console.error("Erreur lors de la mise à jour du profil recruteur", error);
          this.openSnack(
            "❌ Erreur mise à jour du profil : " + (error.message || error.statusText || "Erreur inconnue"),
            "error"
          );

        }
      });
    } else {
      console.warn('submitProfileUpdate: rôle non recruteur, pas de traitement');
    }
    if (this.isAdmin) {
      this.talentService.updateAdminProfile(this.user.id, updatedData).subscribe({
        next: (response) => {
          console.log('Réponse updateAdmin:', response);
          this.openSnack('✅ Profil admin mis à jour', 'success');
          this.editMode = false;
          this.ngOnInit(); // recharger le profil mis à jour
        },
        error: (error) => {
          console.error("Erreur lors de la mise à jour du profil admin", error);
          this.openSnack(
            "❌ Erreur mise à jour du profil : " + (error.message || error.statusText || "Erreur inconnue"),
            "error"
          );

        }
      });
    } else {
      console.warn('submitProfileUpdate: rôle non admin, pas de traitement');
    }

  }

  onReplaceCvClick(cvId: number): void {
    this.replaceCvId = cvId; // Affiche l'input
  }

  onCvFileSelected(event: Event, cvId: number): void {
    const input = event.target as HTMLInputElement;

    if (!input.files || input.files.length === 0) {
      console.warn("Aucun fichier sélectionné.");
      return;
    }

    const file = input.files[0];
    const titre = prompt("Titre du CV (laissez vide pour garder l'ancien):") ?? '';

    this.talentService.replaceCv(cvId, file, titre).subscribe({
      next: (updatedCv) => {
        this.openSnack('✅ CV remplacé avec succès', 'success');
        this.replaceCvId = null;
        this.ngOnInit(); // recharge les données actualisées
      },
      error: (err) => {
        console.error("Erreur lors du remplacement du CV", err);
        this.openSnack('❌ Erreur remplacement CV', 'error');
      }
    });
  }


  onReplaceLettreClick(lettreId: number): void {
    this.replaceLettreId = lettreId; // Affiche l'input
  }

  onLettreFileSelected(event: Event, lettreId: number): void {
    const input = event.target as HTMLInputElement;

    if (!input.files || input.files.length === 0) {
      console.warn("Aucun fichier sélectionné.");
      return;
    }

    const file = input.files[0];
    const titre = prompt("Titre de la lettre (laissez vide pour garder l'ancien) :") ?? '';

    this.talentService.replaceLettre(lettreId, file, titre).subscribe({
      next: (updatedLettre) => {
        this.openSnack('✅ Lettre remplacé avec succès', 'success');
        this.replaceLettreId = null;
        this.ngOnInit();
      },
      error: (err) => {
        console.error("Erreur remplacement lettre", err);
        this.openSnack('❌ Erreur remplacement lettre', 'error');
      }
    });
  }



  saveLangueUpdates(): void {
    if (!this.user?.id || !this.user.competenceLinguistiques) return;

    const payload = this.user.competenceLinguistiques.map(cl => ({
      id: cl.id,
      langue: cl.langue,
      niveau: cl.niveau
    }));

    this.talentService.updateCompetencesLinguistiques(this.user.id, payload).subscribe({
      next: () => {
        this.openSnack('✅ Compétences linguistiques mises à jour', 'success');
        this.editLinguistique = false;
        this.ngOnInit(); // recharge les données
      },
      error: (err) => {
        console.error("Erreur mise à jour compétences linguistiques", err);
        this.openSnack('❌ Erreur mise à jour', 'error');
      }
    });
  }

  cancelLangueEdit(): void {
    this.editLinguistique = false;
    this.ngOnInit(); // Recharger les données d'origine
  }

  addCompetence(): void {
    if (!this.user?.id) {
      this.openSnack('❌ Utilisateur non identifié', 'error');
      return;
    }

    if (this.addCompetenceForm.invalid) {
      this.openSnack('Veuillez remplir le formulaire.', 'error');
      return;
    }

    const competence = this.addCompetenceForm.value;
    const competences = [competence]; // envoie sous forme de tableau

    this.loading = true;
    this.talentService.addCompetences(this.user.id, competences).subscribe({
      next: (res) => {
        this.loading = false;
        this.openSnack('✅ Compétence ajoutée avec succès', 'success');
        this.addCompetenceForm.reset({ niveau: 'DEBUTANT' });
        this.ngOnInit(); // recharge les données
      },
      error: (err) => {
        this.loading = false;
        console.error('Erreur ajout compétence', err);
        this.openSnack('❌ Erreur lors de l’ajout de la compétence', 'error');
      }
    });
  }

  addExperience(): void {
    if (!this.user?.id) {
      this.openSnack('❌ Utilisateur non identifié', 'error');
      return;
    }

    if (this.addExperienceForm.invalid) {
      this.openSnack('Veuillez remplir tous les champs obligatoires.', 'error');
      return;
    }

    const experience = this.addExperienceForm.value;
    const experiences = [experience]; // tableau pour envoi au backend

    this.loading = true;

    this.talentService.addExperiences(this.user.id, experiences).subscribe({
      next: () => {
        this.loading = false;
        this.openSnack('✅ Expérience ajoutée avec succès', 'success');
        this.addExperienceForm.reset();
        this.ngOnInit(); // recharge le profil
      },
      error: (err) => {
        this.loading = false;
        console.error('Erreur ajout expérience', err);
        this.openSnack('❌ Erreur lors de l’ajout de l’expérience', 'error');
      }
    });
  }

  onSubmitMetadonneeRh(): void {
    if (!this.isCandidat || !this.user?.id) {
      this.openSnack('❌ Impossible de mettre à jour les métadonnées RH', 'error');
      return;
    }

    if (this.editMetadonneeRhForm.invalid) {
      this.openSnack("Veuillez corriger les erreurs du formulaire", "error");
      return;
    }

    const dto: MetadonneeRHDTO = this.editMetadonneeRhForm.value;

    this.talentService.updateMetadonneeRH(this.user.id, dto).subscribe({
      next: (updated) => {
        this.user!.metadonneeRH = updated;
        this.editMetadonneeRh = false;
        this.openSnack('✅ Métadonnées RH mises à jour', 'success');
      },
      error: (err) => {
        console.error('Erreur mise à jour métadonnées RH', err);
        this.openSnack('❌  Échec de la mise à jour des métadonnées RH', 'error');
      }
    });
  }
  toggleEditMetadonneeRh(): void {
    if (!this.isCandidat) return; // ✅ ne rien faire pour un recruteur
    this.editMetadonneeRh = !this.editMetadonneeRh;
    if (this.editMetadonneeRh && this.user?.metadonneeRH) {
      this.initEditRhForm();
    }
  }

  /** ✅ méthode utilitaire pour ton SnakBar custom */
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
