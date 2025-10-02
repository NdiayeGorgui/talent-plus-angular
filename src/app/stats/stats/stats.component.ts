import { Component, OnInit } from '@angular/core';
import { ChartData, ChartOptions } from 'chart.js';
import { CompetenceFrequencyDTO, MonthlyCountDTO, StatutCountDTO, TalentService } from '../../services/talent.service';

@Component({
  selector: 'app-stats',
  standalone: false,
  templateUrl: './stats.component.html',
  styleUrl: './stats.component.css'
})
export class StatsComponent implements OnInit {

  // Pie Chart - Candidatures par statut
  statutData: ChartData<'pie'> = { labels: [], datasets: [] };
  statutOptions: ChartOptions<'pie'> = { responsive: true };

  // Bar Chart - Candidatures par mois
  moisData: ChartData<'bar'> = { labels: [], datasets: [] };
  moisOptions: ChartOptions<'bar'> = {
    responsive: true,
    plugins: { legend: { display: false } }
  };

  // Horizontal Bar Chart - Compétences fréquentes
  competenceData: ChartData<'bar'> = { labels: [], datasets: [] };
  competenceOptions: ChartOptions<'bar'> = {
    indexAxis: 'y',
    responsive: true,
    plugins: { legend: { display: false } }
  };

  constructor(private talentService: TalentService) {}

  ngOnInit(): void {
    this.loadStatuts();
    this.loadMois();
    this.loadCompetences();
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
}
