import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CandidatsListComponent } from './candidats/candidats-list/candidats-list.component';
import { CreateCandidatComponent } from './candidats/create-candidat/create-candidat.component';
import { CandidatDetailComponent } from './candidats/candidat-detail/candidat-detail.component';
import { OffresListComponent } from './offres/offres-list/offres-list.component';
import { CreateOffreComponent } from './offres/create-offre/create-offre.component';
import { OffreDetailComponent } from './offres/offre-detail/offre-detail.component';
import { CreateRecrutementComponent } from './recrutements/create-recrutement/create-recrutement.component';
import { DashboardComponent } from './dashboard/dashboard/dashboard.component';
import { StatsComponent } from './stats/stats/stats.component';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { RecruteursListComponent } from './recruteurs/recruteurs-list/recruteurs-list.component';
import { CreateRecruteurComponent } from './recruteurs/create-recruteur/create-recruteur.component';
import { RecruteurDetailComponent } from './recruteurs/recruteur-detail/recruteur-detail.component';
import { MaterialModule } from './material.module';
import { HomeComponent } from './home/home.component';
import { LayoutComponent } from './layout/layout.component';
import { NgChartsModule } from 'ng2-charts';
import { CandidatWizardComponent } from './candidats/candidat-wizard/candidat-wizard.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CompetencesStepComponent } from './candidats/competences-step/competences-step.component';
import { ExperiencesStepComponent } from './candidats/experiences-step/experiences-step.component';
import { DocumentsStepComponent } from './candidats/documents-step/documents-step.component';
import { RecapitulatifComponent } from './candidats/recapitulatif/recapitulatif.component';
import { RecrutementsListComponent } from './recrutements/recrutements-list/recrutements-list.component';
import { HistoriqueDialogComponent } from './recrutements/historique-dialog/historique-dialog.component';
import { MetadonneeRhStepComponent } from './candidats/metadonnee-rh-step/metadonnee-rh-step.component';
import { CandidatureSpontaneeComponent } from './candidats/candidature-spontanee/candidature-spontanee.component';
import { ProfilComponent } from './profil/profil.component';
import { TokenInterceptor } from './interceptors/token.interceptor';
import { LoginRegisterComponent } from './auth/login-register/login-register.component';
import { QuillModule } from 'ngx-quill';
import 'quill/dist/quill.snow.css';
import { MesApplicationsComponent } from './recrutements/mes-applications/mes-applications.component';
import { CreateEmployeurComponent } from './employeurs/create-employeur/create-employeur.component';
import { EmployeurListComponent } from './employeurs/employeur-list/employeur-list.component';
import { PosterOffreComponent } from './employeurs/poster-offre/poster-offre.component';
import { EmployeurDetailsComponent } from './employeurs/employeur-details/employeur-details.component';
import { EmployeurWizardComponent } from './employeurs/employeur-wizard/employeur-wizard.component';
import { InfoComponent } from './info/info.component';
import { NotificationBellComponent } from './notification-bell/notification-bell.component';
import { SnakBarComponent } from './shared/snak-bar/snak-bar.component'; // style par défaut


@NgModule({
  declarations: [
    AppComponent,
    CandidatsListComponent,
    CreateCandidatComponent,
    CandidatDetailComponent,
    CandidatWizardComponent,
    OffresListComponent,
    CreateOffreComponent,
    OffreDetailComponent,
    CreateRecrutementComponent,
    DashboardComponent,
    StatsComponent,
    LoginComponent,
    RegisterComponent,
    RecruteursListComponent,
    CreateRecruteurComponent,
    RecruteurDetailComponent,
    HomeComponent,


    LayoutComponent,
    CompetencesStepComponent,
    ExperiencesStepComponent,
    DocumentsStepComponent,
    RecapitulatifComponent,
    RecrutementsListComponent,
    HistoriqueDialogComponent,
    MetadonneeRhStepComponent,
    CandidatureSpontaneeComponent,
    ProfilComponent,
    LoginRegisterComponent,
    MesApplicationsComponent,
    CreateEmployeurComponent,
    EmployeurListComponent,
    PosterOffreComponent,
    EmployeurDetailsComponent,
    EmployeurWizardComponent,
    InfoComponent,
    NotificationBellComponent,
  
    SnakBarComponent,
    
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AppRoutingModule,
    NgChartsModule,
    QuillModule.forRoot(),
    MaterialModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
