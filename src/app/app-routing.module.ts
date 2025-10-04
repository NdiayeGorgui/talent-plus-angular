import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Layout
import { LayoutComponent } from './layout/layout.component';

// Candidats
import { CandidatsListComponent } from './candidats/candidats-list/candidats-list.component';
import { CreateCandidatComponent } from './candidats/create-candidat/create-candidat.component';
import { CandidatDetailComponent } from './candidats/candidat-detail/candidat-detail.component';

// Recruteurs
import { RecruteursListComponent } from './recruteurs/recruteurs-list/recruteurs-list.component';
import { CreateRecruteurComponent } from './recruteurs/create-recruteur/create-recruteur.component';
import { RecruteurDetailComponent } from './recruteurs/recruteur-detail/recruteur-detail.component';

// Offres
import { OffresListComponent } from './offres/offres-list/offres-list.component';
import { CreateOffreComponent } from './offres/create-offre/create-offre.component';
import { OffreDetailComponent } from './offres/offre-detail/offre-detail.component';

// Recrutements
import { CreateRecrutementComponent } from './recrutements/create-recrutement/create-recrutement.component';

// Dashboard
import { DashboardComponent } from './dashboard/dashboard/dashboard.component';

// Auth
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';

// Home
import { HomeComponent } from './home/home.component';
import { CandidatWizardComponent } from './candidats/candidat-wizard/candidat-wizard.component';
import { RecrutementsListComponent } from './recrutements/recrutements-list/recrutements-list.component';
import { CandidatureSpontaneeComponent } from './candidats/candidature-spontanee/candidature-spontanee.component';
import { ProfilComponent } from './profil/profil.component';

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent, // ton cadre global
    children: [
      { path: '', component: HomeComponent }, // page d'accueil
      { path: 'dashboard', component: DashboardComponent },

      // Candidats
      { path: 'candidats', component: CandidatsListComponent },
      { path: 'candidats/create', component: CreateCandidatComponent },
      { path: 'candidats/:id', component: CandidatDetailComponent },
      { path: 'candidats/postuler/:offreId', component: CandidatWizardComponent },

       // Candidatures spontanées
      { path: 'candidature-spontanee', component: CandidatureSpontaneeComponent },
      { path: 'candidature-spontanee/:candidatId', component: CandidatureSpontaneeComponent },
      { path: 'candidature/postuler', component: CandidatWizardComponent },

     
      // Recruteurs
      { path: 'recruteurs', component: RecruteursListComponent },
      { path: 'recruteurs/create', component: CreateRecruteurComponent },
      { path: 'recruteurs/:id', component: RecruteurDetailComponent },
     

      // Offres
      { path: 'offres', component: OffresListComponent },
      { path: 'offres/create', component: CreateOffreComponent },
      { path: 'offres/:id', component: OffreDetailComponent },

      // Recrutements
     
      { path: 'recrutements', component: RecrutementsListComponent },                        // liste all
                       
      { path: 'recrutements/candidat/:candidatId', component: RecrutementsListComponent },    // liste filtrée par candidat
      { path: 'recrutements/offre/:offreId', component: RecrutementsListComponent },  
       { path:'recrutements/lier/:processusId', component: CreateRecrutementComponent},
       //user
       { path: 'profil', component: ProfilComponent },
    ],
  },

  // Auth (pas dans Layout → pas de navbar/colonnes/footer)
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },

  // Wildcard (si URL inconnue → redirection)
  { path: '**', redirectTo: '' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
