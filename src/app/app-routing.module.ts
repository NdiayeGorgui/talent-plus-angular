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
import { AuthGuard } from './guards/auth.guard';
import { MesApplicationsComponent } from './recrutements/mes-applications/mes-applications.component';
import { EmployeurListComponent } from './employeurs/employeur-list/employeur-list.component';
import { CreateEmployeurComponent } from './employeurs/create-employeur/create-employeur.component';
import { EmployeurDetailsComponent } from './employeurs/employeur-details/employeur-details.component';
import { EmployeurWizardComponent } from './employeurs/employeur-wizard/employeur-wizard.component';
import { InfoComponent } from './info/info.component';

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent, // ton cadre global
    children: [
      { path: '', component: HomeComponent }, // page d'accueil
      { path: 'dashboard', component: DashboardComponent , canActivate: [AuthGuard]},

        { path: 'info/:type', component: InfoComponent},

      // Candidats
      { path: 'candidats', component: CandidatsListComponent , canActivate: [AuthGuard]},
      { path: 'candidats/create', component: CreateCandidatComponent },
      { path: 'candidats/:id', component: CandidatDetailComponent },
      { path: 'candidats/postuler/:offreId', component: CandidatWizardComponent },

       // Candidatures spontanées
      { path: 'candidature-spontanee', component: CandidatureSpontaneeComponent },
      { path: 'candidature-spontanee/:candidatId', component: CandidatureSpontaneeComponent },
      { path: 'candidature/postuler', component: CandidatWizardComponent },

     
      // Recruteurs
      { path: 'recruteurs', component: RecruteursListComponent , canActivate: [AuthGuard]},
      { path: 'recruteurs/create', component: CreateRecruteurComponent },
      { path: 'recruteurs/:id', component: RecruteurDetailComponent },
     

      // Offres
      { path: 'offres', component: OffresListComponent , canActivate: [AuthGuard]},
      { path: 'offres/create', component: CreateOffreComponent },
      { path: 'offres/:id', component: OffreDetailComponent },

       // employeur
      { path: 'employeurs', component: EmployeurListComponent, canActivate: [AuthGuard]},
      { path: 'employeurs/create', component: CreateEmployeurComponent },
      { path: 'employeurs/edit/:id', component: EmployeurDetailsComponent },
      { path: 'employeurs/employeur-wizard', component: EmployeurWizardComponent },

      // Recrutements
     
      { path: 'recrutements', component: RecrutementsListComponent , canActivate: [AuthGuard]},                        // liste all
                       
      { path: 'recrutements/candidat/:candidatId', component: RecrutementsListComponent },    // liste filtrée par candidat
      { path: 'recrutements/offre/:offreId', component: RecrutementsListComponent },  
       { path:'recrutements/lier/:processusId', component: CreateRecrutementComponent},
        { path:'recrutements/offres/mes-applications', component: MesApplicationsComponent},
       //user
       { path: 'profil', component: ProfilComponent , canActivate: [AuthGuard]},
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
