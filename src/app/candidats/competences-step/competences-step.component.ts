import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CompetenceDTO, CompetenceLingustiqueDTO } from '../../services/talent.service';

@Component({
  selector: 'app-competences-step',
  standalone: false,
  templateUrl: './competences-step.component.html',
  styleUrls: ['./competences-step.component.css']
})
export class CompetencesStepComponent {

  competenceOptions: string[] = [
    'Java', 'Spring boot', 'JPA', 'Python', 'JavaScript', 'TypeScript', 'C#',
    'Node.js', 'Angular', 'React', 'Vue.js', 'HTML/CSS', 'SQL Server',
    'SQL', 'MongoDB', 'UML', 'DevOps', 'Docker', 'Kubernetes',
    'Linux', 'AWS', 'Azure', 'Git / GitHub', 'Agile / Scrum'
  ];

  languesOptions: string[] = ['Francais', 'Anglais', 'Espagnol', 'Arabe', 'Allemand', 'Italien'];

  @Output() valid = new EventEmitter<{
    techniques: CompetenceDTO[],
    linguistiques: CompetenceLingustiqueDTO[]
  }>();
  @Output() next = new EventEmitter<void>();
  @Output() previous = new EventEmitter<void>();

  competenceForm!: FormGroup;
  langueForm!: FormGroup;

  competences: CompetenceDTO[] = [];
  competencesLinguistiques: CompetenceLingustiqueDTO[] = [];

  constructor(private fb: FormBuilder) {
    this.competenceForm = this.fb.group({
      libelle: ['', Validators.required],
      niveau: ['DEBUTANT', Validators.required]
    });

    this.langueForm = this.fb.group({
      langue: ['', Validators.required],
      niveau: ['DEBUTANT', Validators.required]
    });
  }

  addCompetence() {
    if (this.competenceForm.valid) {
      this.competences.push(this.competenceForm.value);
      this.competenceForm.reset({ niveau: 'DEBUTANT' });
      this.emitValid();
    }
  }

  addLangue() {
    if (this.langueForm.valid) {
      this.competencesLinguistiques.push(this.langueForm.value);
      this.langueForm.reset({ niveau: 'DEBUTANT' });
      this.emitValid();
    }
  }

  removeCompetence(index: number) {
    this.competences.splice(index, 1);
    this.emitValid();
  }

  removeLangue(index: number) {
    this.competencesLinguistiques.splice(index, 1);
    this.emitValid();
  }

  emitValid() {
    this.valid.emit({
      techniques: this.competences,
      linguistiques: this.competencesLinguistiques
    });
  }

  goNext() {
    this.emitValid();
    this.next.emit();
  }

  goPrevious() {
    this.previous.emit();
  }
}