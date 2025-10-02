import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ExperienceDTO } from '../../services/talent.service';


@Component({
  selector: 'app-experiences-step',
  standalone: false,
  templateUrl: './experiences-step.component.html',
  styleUrls: ['./experiences-step.component.css']
})
export class ExperiencesStepComponent {
  @Output() valid = new EventEmitter<ExperienceDTO[]>();
  @Output() next = new EventEmitter<void>();

  experienceForm!: FormGroup;
  experiences: ExperienceDTO[] = [];

  constructor(private fb: FormBuilder) {
    this.experienceForm = this.fb.group({
      poste: ['', Validators.required],
      entreprise: ['', Validators.required],
      dateDebut: ['', Validators.required],
      dateFin: [''],
      description: ['']
    });
  }

  addExperience() {
    if (this.experienceForm.valid) {
      this.experiences.push(this.experienceForm.value);
      this.experienceForm.reset();
      this.valid.emit(this.experiences);
    }
  }

  removeExperience(index: number) {
    this.experiences.splice(index, 1);
    this.valid.emit(this.experiences);
  }

  goNext() {
    this.next.emit();
  }
}
