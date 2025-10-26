import { Component, OnInit } from '@angular/core';
import { ChartData, ChartOptions } from 'chart.js';
import {
  CompetenceFrequencyDTO,
  MonthlyCountDTO,
  StatutCountDTO,
  OffreCountDTO,
  TalentService
} from '../../services/talent.service';

@Component({
  selector: 'app-dashboard',
  standalone: false,
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {

  statutData: ChartData<'pie'> = { labels: [], datasets: [] };
  statutOptions: ChartOptions<'pie'> = { responsive: true };

  moisData: ChartData<'bar'> = { labels: [], datasets: [] };
  moisOptions: ChartOptions<'bar'> = {
    responsive: true,
    plugins: { legend: { display: false } }
  };

  competenceData: ChartData<'bar'> = { labels: [], datasets: [] };
  competenceOptions: ChartOptions<'bar'> = {
    indexAxis: 'y',
    responsive: true,
    plugins: { legend: { display: false } }
  };

  employeurData: ChartData<'bar'> = { labels: [], datasets: [] };
  employeurOptions: ChartOptions<'bar'> = {
    responsive: true,
    plugins: { legend: { display: false } }
  };

  recruteurData: ChartData<'bar'> = { labels: [], datasets: [] };
  recruteurOptions: ChartOptions<'bar'> = {
    responsive: true,
    plugins: { legend: { display: false } }
  };

  constructor(private talentService: TalentService) {}

  ngOnInit(): void {
    this.loadStatuts();
    this.loadMois();
    this.loadCompetences();
    this.loadOffresParEmployeur();
    this.loadOffresParRecruteur();
  }

  private loadStatuts(): void {
    this.talentService.getCandidaturesParStatut()
      .subscribe((data: StatutCountDTO[]) => {
        this.statutData = {
          labels: data.map(d => d.statut),
          datasets: [{
            data: data.map(d => d.count),
            backgroundColor: ['#3f51b5', '#e91e63', '#4caf50', '#ff9800']
          }]
        };
      });
  }

  private loadMois(): void {
    this.talentService.getCandidaturesParMois()
      .subscribe((data: MonthlyCountDTO[]) => {
        this.moisData = {
          labels: data.map(d => d.mois),
          datasets: [{
            label: 'Candidatures',
            data: data.map(d => d.count),
            backgroundColor: '#3f51b5'
          }]
        };
      });
  }

  private loadCompetences(): void {
    this.talentService.getCompetencesFrequentes()
      .subscribe((data: CompetenceFrequencyDTO[]) => {
        this.competenceData = {
          labels: data.map(d => d.competence),
          datasets: [{
            label: 'Fréquence',
            data: data.map(d => d.frequency),
            backgroundColor: '#4caf50'
          }]
        };
      });
  }

  private loadOffresParEmployeur(): void {
    this.talentService.getOffresParEmployeur().subscribe((data: any[]) => {
      const sorted = [...data].sort((a, b) => b.nombreOffres - a.nombreOffres);

      const nomsComplets = sorted.map(d => this.buildNomComplet(d));
      const labels = nomsComplets.map(n => this.formatNom(n));

      console.log('Employeurs raw noms:', nomsComplets);
      console.log('Employeurs labels:', labels);

      this.employeurData = {
        labels: labels,
        datasets: [{
          label: 'Nombre d’offres',
          data: sorted.map(d => d.nombreOffres),
          backgroundColor: '#FF9800'
        }]
      };

      this.employeurOptions = {
        responsive: true,
        indexAxis: 'y',
        plugins: {
          legend: { display: false },
          title: {
            display: true,
            text: 'Top Employeurs par nombre d’offres',
            font: { size: 16 }
          }
        },
        scales: {
          x: { beginAtZero: true },
          y: { ticks: { font: { size: 12 } } }
        }
      };
    });
  }

  private loadOffresParRecruteur(): void {
    this.talentService.getOffresParRecruteur().subscribe((data: any[]) => {
      const sorted = [...data].sort((a, b) => b.nombreOffres - a.nombreOffres);

      const nomsComplets = sorted.map(d => this.buildNomComplet(d));
      const labels = nomsComplets.map(n => this.formatNom(n));

      console.log('Recruteurs raw noms:', nomsComplets);
      console.log('Recruteurs labels:', labels);

      this.recruteurData = {
        labels: labels,
        datasets: [{
          label: 'Nombre d’offres',
          data: sorted.map(d => d.nombreOffres),
          backgroundColor: '#2196F3'
        }]
      };

      this.recruteurOptions = {
        responsive: true,
        indexAxis: 'y',
        plugins: {
          legend: { display: false },
          title: {
            display: true,
            text: 'Top Recruteurs par nombre d’offres',
            font: { size: 16 }
          }
        },
        scales: {
          x: { beginAtZero: true },
          y: { ticks: { font: { size: 12 } } }
        }
      };
    });
  }

  private buildNomComplet(d: any): string {
    if (!d) return 'Inconnu';
    // Si l’objet a prénom et nom
    if (typeof d.prenom === 'string' && typeof d.nom === 'string') {
      return `${d.prenom} ${d.nom}`;
    }
    // Si le backend fournit un champ “nomComplet” ou “fullName”
    if (typeof (d as any).nomComplet === 'string') {
      return (d as any).nomComplet;
    }
    if (typeof d.nom === 'string') {
      return d.nom;
    }
    // Si d est déjà string
    if (typeof d === 'string') {
      return d;
    }
    // Autre cas
    return 'Inconnu';
  }

  private formatNom(nom: string): string {
    if (!nom) return 'Inconnu';
    return nom.length > 25 ? nom.slice(0, 22) + '…' : nom;
  }

}
