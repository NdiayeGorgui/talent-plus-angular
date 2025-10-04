import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-metadonnee-rh-step',
  standalone: false,
  templateUrl: './metadonnee-rh-step.component.html',
  styleUrls: ['./metadonnee-rh-step.component.css']
})
export class MetadonneeRhStepComponent {
  @Output() valid = new EventEmitter<any>();
  @Output() next = new EventEmitter<void>();
  @Output() previous = new EventEmitter<void>();

  metadonneeForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.metadonneeForm = this.fb.group({
      domaineRecherche: ['', Validators.required],
      typeContrat: ['', Validators.required],
      localisation: ['', Validators.required],
      disponibilite: ['', Validators.required],
      pretentionsSalariales: [''],
      source: ['']
    });
  }

  goNext() {
    if (this.metadonneeForm.valid) {
      this.valid.emit(this.metadonneeForm.value);
      this.next.emit();
    }
  }

  goPrevious() {
    this.previous.emit();
  }
}