import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TalentService, CandidatDTO, PostulerDTO, CompetenceLingustiqueDTO, CompetenceDTO } from '../../services/talent.service';

@Component({
  selector: 'app-candidat-wizard',
  standalone: false,
  templateUrl: './candidat-wizard.component.html',
  styleUrls: ['./candidat-wizard.component.css'] // ⚠️ "styleUrl" → "styleUrls"
})
export class CandidatWizardComponent implements OnInit {
  offreId!: number;

  candidatForm!: FormGroup;

  // 🔹 Données globales
  candidatDTO: CandidatDTO | null = null;
  competences: any[] = [];  
  competencesLinguistiques: any[] = [];
  experiences: any[] = [];
  cv: any;
  lettre: any;
  metadonneeRH: any;


  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private talentService: TalentService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.offreId = +this.route.snapshot.params['offreId']; // parse en number

    this.candidatForm = this.fb.group({
      nom: ['', Validators.required],
      prenom: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      telephone: ['', Validators.required],
      dateNaissance: ['', Validators.required],
      adresse: [''],
      niveauEtude: ['',Validators.required]
    });
  }

  // =====================
  // Handlers des enfants
  // =====================
  // onCompetencesSaved(list: any[]) {
  //   this.competences = list;
  // }

onCompetencesSaved(data: { techniques: CompetenceDTO[]; linguistiques: CompetenceLingustiqueDTO[] }) {
  this.competences = data.techniques;
  this.competencesLinguistiques = data.linguistiques;
}



  onExperiencesSaved(list: any[]) {
    this.experiences = list;
  }

  onDocumentsSaved(data: {
    cv?: { file: File, titre: string },
    lettre?: { file: File, titre: string }
  }) {
    this.cv = data.cv;
    this.lettre = data.lettre;
  }

  onMetadonneeSaved(dto: any) {
    console.log('metadonnee reçue :', dto);
    this.metadonneeRH = dto;
  }



  postuler(candidatId: number) {
    const postulerDTO: PostulerDTO = {
      candidatId,
      offreId: this.offreId
    };

    this.talentService.postuler(postulerDTO).subscribe({
      next: () => alert('✅ Votre candidature a été envoyée avec succès !'),
      error: err => console.error('Erreur lors de la postulation:', err)
    });
  }

  // =====================
  // Soumission
  // =====================
submit() {
  const candidat: CandidatDTO = {
    ...this.candidatForm.value
  };

  this.talentService.createCandidat(candidat).subscribe({
    next: (created: CandidatDTO) => {
      const candidatId = created.id!;
      this.candidatDTO = created;

      // 1. Ajouter les compétences techniques
      this.talentService.addCompetences(candidatId, this.competences).subscribe({
        next: () => {
          // 1.b Ajouter les compétences linguistiques
          this.talentService.addCompetencesLinguistiques(candidatId, this.competencesLinguistiques).subscribe({
            next: () => {
              // 2. Ajouter les expériences
              this.talentService.addExperiences(candidatId, this.experiences).subscribe({
                next: () => {
                  // 3. Ajouter les métadonnées RH
                  this.talentService.addMetadonneeRH(candidatId, this.metadonneeRH).subscribe({
                    next: () => {
                      // 4. Upload du CV
                      if (this.cv) {
                        const { file, titre } = this.cv;
                        this.talentService.uploadCv(candidatId, file, titre).subscribe({
                          next: () => {
                            // 5. Upload lettre
                            if (this.lettre) {
                              const { file: lettreFile, titre: lettreTitre } = this.lettre;
                              this.talentService.uploadLettre(candidatId, lettreFile, lettreTitre).subscribe({
                                next: () => this.postuler(candidatId),
                                error: err => console.error('❌ Erreur upload lettre:', err)
                              });
                            } else {
                              this.postuler(candidatId);
                            }
                          },
                          error: err => console.error('❌ Erreur upload CV:', err)
                        });
                      } else {
                        this.postuler(candidatId);
                      }
                    },
                    error: err => console.error('❌ Erreur ajout métadonnées RH:', err)
                  });
                },
                error: err => console.error('❌ Erreur ajout expériences:', err)
              });
            },
            error: err => console.error('❌ Erreur ajout compétences linguistiques:', err)
          });
        },
        error: err => console.error('❌ Erreur ajout compétences:', err)
      });
    },
    error: err => console.error('❌ Erreur création candidat:', err)
  });
}


  annuler() {
    this.router.navigate(['/offres']); // 🔁 Change '/offres' selon ta route réelle
  }

  postulerSpontanee(candidatId: number) {
  const dto: PostulerDTO = {
    candidatId
    // pas d’offreId ici, car c’est une candidature spontanée
    ,
    offreId: 0
  };

  this.talentService.postulerSpontanee(dto).subscribe({
    next: () => alert('✅ Votre candidature spontanée a été envoyée avec succès !'),
    error: err => console.error('❌ Erreur postulerSpontanee:', err)
  });
}


soumettreCandidature() {
  if (this.offreId) {
    this.submit(); // Candidature normale
  } else {
    this.submitSpontanee(); // Candidature spontanée
  }
}
submitSpontanee() {
  const candidat: CandidatDTO = {
    ...this.candidatForm.value
  };

  this.talentService.createCandidat(candidat).subscribe({
    next: (created: CandidatDTO) => {
      const candidatId = created.id!;
      this.candidatDTO = created;

      // 1. Ajouter les compétences techniques
      this.talentService.addCompetences(candidatId, this.competences).subscribe({
        next: () => {
          // 1.b Ajouter les compétences linguistiques
          this.talentService.addCompetencesLinguistiques(candidatId, this.competencesLinguistiques).subscribe({
            next: () => {
              // 2. Ajouter les expériences
              this.talentService.addExperiences(candidatId, this.experiences).subscribe({
                next: () => {
                  // 3. Ajouter les métadonnées RH
                  this.talentService.addMetadonneeRH(candidatId, this.metadonneeRH).subscribe({
                    next: () => {
                      // 4. Upload CV
                      if (this.cv) {
                        const { file, titre } = this.cv;
                        this.talentService.uploadCv(candidatId, file, titre).subscribe({
                          next: () => {
                            // 5. Upload lettre
                            if (this.lettre) {
                              const { file: lettreFile, titre: lettreTitre } = this.lettre;
                              this.talentService.uploadLettre(candidatId, lettreFile, lettreTitre).subscribe({
                                next: () => this.postulerSpontanee(candidatId),
                                error: err => console.error('❌ Erreur upload lettre:', err)
                              });
                            } else {
                              this.postulerSpontanee(candidatId);
                            }
                          },
                          error: err => console.error('❌ Erreur upload CV:', err)
                        });
                      } else {
                        this.postulerSpontanee(candidatId);
                      }
                    },
                    error: err => console.error('❌ Erreur ajout métadonnées RH:', err)
                  });
                },
                error: err => console.error('❌ Erreur ajout expériences:', err)
              });
            },
            error: err => console.error('❌ Erreur ajout compétences linguistiques:', err)
          });
        },
        error: err => console.error('❌ Erreur ajout compétences:', err)
      });
    },
    error: err => console.error('❌ Erreur création candidat:', err)
  });
}



}
