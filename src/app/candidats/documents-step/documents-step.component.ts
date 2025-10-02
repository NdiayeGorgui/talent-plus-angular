import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-documents-step',
  standalone: false,
  templateUrl: './documents-step.component.html',
  styleUrls: ['./documents-step.component.css']
})
export class DocumentsStepComponent {
  @Output() valid = new EventEmitter<{
    cv?: { file: File, titre: string },
    lettre?: { file: File, titre: string }
  }>();
  @Output() next = new EventEmitter<void>();
  @Output() previous = new EventEmitter<void>();

  cv?: File;
  cvTitre: string = '';

  lettre?: File;
  lettreTitre: string = '';

  onCvSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (file) {
      this.cv = file;
      console.log('📄 CV sélectionné:', file);
    }
    this.emitValid();
  }

  onLettreSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (file) {
      this.lettre = file;
      console.log('✉️ Lettre sélectionnée:', file);
    }
    this.emitValid();
  }

  emitValid() {
    this.valid.emit({
      cv: this.cv ? { file: this.cv, titre: this.cvTitre } : undefined,
      lettre: this.lettre ? { file: this.lettre, titre: this.lettreTitre } : undefined
    });
  }

  goNext() {
    this.next.emit();
  }

  goPrevious() {
    this.previous.emit();
  }
}
