import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CompetenceDTO } from '../../services/talent.service';


@Component({
  selector: 'app-competences-step',
  standalone: false,
  templateUrl: './competences-step.component.html',
  styleUrls: ['./competences-step.component.css']
})
export class CompetencesStepComponent {

  competenceOptions: string[] = [
  'Java', 'Spring boot', 'JPA', 'Python', 'JavaScript', 'TypeScript', 'C#',
  'Node.js', 'Angular', 'React', 'Vue.js', 'HTML/CSS','SQL Server',
  'SQL', 'MongoDB', 'UML', 'DevOps', 'Docker', 'Kubernetes',
  'Linux', 'AWS', 'Azure', 'Git / GitHub', 'Agile / Scrum'
];

  @Output() valid = new EventEmitter<CompetenceDTO[]>();
  @Output() next = new EventEmitter<void>();

  competenceForm!: FormGroup;
  competences: CompetenceDTO[] = [];

  constructor(private fb: FormBuilder) {
    this.competenceForm = this.fb.group({
      libelle: ['', Validators.required],
      niveau: ['DEBUTANT', Validators.required]
    });
  }

  addCompetence() {
    if (this.competenceForm.valid) {
      this.competences.push(this.competenceForm.value);
      this.competenceForm.reset({ niveau: 'DEBUTANT' });
      this.valid.emit(this.competences);
    }
  }

  removeCompetence(index: number) {
    this.competences.splice(index, 1);
    this.valid.emit(this.competences);
  }

  goNext() {
    this.next.emit();
  }
}
