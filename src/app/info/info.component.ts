import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-info',
  standalone: false,
  templateUrl: './info.component.html',
  styleUrl: './info.component.css'
})
export class InfoComponent implements OnInit {
  type: string = '';
  title: string = '';
  description: string = '';
  bulletPoints: string[] = [];
  iconUrl: string = '';
  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.type = this.route.snapshot.paramMap.get('type') || '';
    this.loadInfo();
  }

  loadInfo() {
  switch (this.type) {
    case 'candidat':
      this.title = 'Bienvenue, futur talent ! 🎯';
      this.description = 'En tant que candidat sur Talent+, vous bénéficiez de :';
      this.bulletPoints = [
        '🔍 Accès à des centaines d’offres dans le secteur IT',
        '📄 Postulez en quelques clics',
        '📬 Suivi des candidatures en temps réel',
        '🎯 Suggestions d’offres personnalisées',
      ];
      this.iconUrl = 'assets/icons/candidat.svg';
      break;

    case 'recruteur':
      this.title = 'Recrutez les meilleurs profils IT 👥';
      this.description = 'En tant que recruteur sur Talent+, vous pouvez :';
      this.bulletPoints = [
        '📢 Publier vos offres d’emploi rapidement',
        '⚙️ Gérer et filtrer les candidatures',
        '📊 Suivre l’efficacité de vos annonces',
        '💬 Collaborer avec les employeurs',
      ];
      this.iconUrl = 'assets/icons/recruteur.svg';
      break;

    case 'employeur':
      this.title = 'Gérez vos offres et trouvez les bons talents 🏢';
      this.description = 'En tant qu’employeur sur Talent+, vous bénéficiez de :';
      this.bulletPoints = [
        '📝 Création facile d’offres d’emploi',
        '📎 Association des offres à vos recruteurs',
        '⏱️ Suivi du processus de recrutement',
        '📈 Statistiques sur les performances des offres',
      ];
      this.iconUrl = 'assets/icons/employeur.svg';
      break;

    default:
      this.title = 'Page non trouvée ❌';
      this.description = 'Le type de profil demandé est invalide.';
      this.bulletPoints = [];
      this.iconUrl = 'assets/icons/404.svg';
  }
}
}