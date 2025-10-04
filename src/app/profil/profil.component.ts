import { Component, OnInit } from '@angular/core';
import { TalentService, UserProfileDTO } from '../services/talent.service';


@Component({
  selector: 'app-profil',
  standalone: false,
  templateUrl: './profil.component.html',  
  styleUrl: './profil.component.css'
})
export class ProfilComponent implements OnInit {
  user?: UserProfileDTO;

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

  constructor(private talentService: TalentService) {}

  ngOnInit(): void {
    this.talentService.getMyProfile().subscribe({
      next: (u) => this.user = u,
      error: err => console.error('Erreur récupération profil', err)
    });
  }
}