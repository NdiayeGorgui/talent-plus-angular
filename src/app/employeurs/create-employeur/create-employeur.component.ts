import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { EmployeurDTO, TalentService } from '../../services/talent.service';


@Component({
  selector: 'app-create-employeur',
  standalone: false,
  templateUrl: './create-employeur.component.html',
  styleUrls: ['./create-employeur.component.css']
})
export class CreateEmployeurComponent implements OnInit {

  employeurForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private talentService: TalentService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.employeurForm = this.fb.group({
      nom: ['', Validators.required],
      typeEntreprise: ['', Validators.required],
      emailContact: ['', [Validators.required, Validators.email]],
      telephone: ['', Validators.required],
      poste: [''],
      adresse: [''],
      ville: [''],
      pays: ['']
    });
  }

  onSubmit(): void {
    if (this.employeurForm.invalid) return;

    const employeur: EmployeurDTO = this.employeurForm.value;
    this.talentService.createEmployeur(employeur).subscribe({
      next: () => {
        alert('✅ Employeur ajouté avec succès !');
        this.router.navigate(['/employeurs']);
      },
      error: (err) => {
        console.error('Erreur lors de la création de l’employeur', err);
        alert('❌ Erreur lors de la création.');
      }
    });
  }

  onCancel(): void {
    this.router.navigate(['/employeurs']);
  }
}
