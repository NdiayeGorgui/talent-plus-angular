import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { Observable, switchMap } from 'rxjs';
import { environment } from '../../environments/environment.development';



// ======================
// DTOs
// ======================

export interface UserProfileDTO {
  id: number;
  role: 'CANDIDAT' | 'RECRUTEUR' | 'EMPLOYEUR' | 'ADMIN';
  nom: string;
  prenom?: string;
  email: string;
  emailContact?: string;
  telephone?: string;
  dateNaissance?: string;
  adresse?: string;
  niveauEtude?: string;
  poste?: string;
  niveau?: string;

  // Pour candidat
  metadonneeRH?: MetadonneeRHDTO;
  cvs?: CvDTO[];
  lettres?: LettreDTO[];
  experiences?: ExperienceDTO[];
  competences?: CompetenceDTO[];
  competenceLinguistiques?: CompetenceLingustiqueDTO[];

  // Pour recruteur / employeur
  offres?: OffreDTO[];
  entreprise?: string;
  // etc.
}
export interface CandidatDTO {
  id?: number;
  nom: string;
  prenom: string;
  email: string;
  telephone?: string;
  dateNaissance?: string; // ISO string pour LocalDate
  adresse?: string;
  niveauEtude?: string;
}

export interface CandidatResponseDTO {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  dateNaissance: string;   //  en JSON ce sera une string (ex: "1990-05-01")
  adresse: string;
  niveauEtude?: string;
  metadonneeRH: MetadonneeRHDTO;

  cvs: CvDTO[];
  lettres: LettreDTO[];
  experiences: ExperienceDTO[];
  competences: CompetenceDTO[];
  competenceLingustiques: CompetenceLingustiqueDTO[];
}

export interface MetadonneeRHDTO {
  id?: number;
  domaineRecherche: string;
  typeContrat: string;
  localisation: string;
  disponibilite: string;
  pretentionsSalariales: number;
  source: String;

}

export interface OffreDTO {
  id?: number;
  titre: string;
  description?: string;
  datePublication?: string; // ISO string pour LocalDateTime
  dateFinAffichage?: string; // ISO string pour LocalDateTime
  categorie?: string;
  ville?: string;
  pays?: string;
  active: boolean;
  recruteurId: number;
  employeurId: number;
}

export interface RecruteurDTO {
  id?: number;
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  poste: string;
  niveau: string;
}

export interface AdminDTO {
  id?: number;
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  poste: string;

}

export interface StatutCountDTO {
  statut: string;
  count: number;
}

export interface MonthlyCountDTO {
  mois: string;
  count: number;
}

export interface CompetenceFrequencyDTO {
  competence: string;
  frequency: number;
}

export interface PostulerDTO {
  candidatId: number;
  offreId: number;
}

export interface ProcessusDTO {
  id?: number;
  candidatId: number;
  offreId: number;
  typeCandidature: string;
  statut: string;
  dateMaj?: string; // LocalDateTime en Java → string (ISO) en TS
  titreOffre: string;
  categorieOffre: string;
}

// ======================
//  Historique Processus
// ======================
export interface HistoriqueDTO {
  id?: number;
  processusId: number;
  statut: string;
  dateChangement: string; // LocalDateTime → string ISO
  recruteur: string;      // login ou id du recruteur
}


export interface CvDTO {
  id?: number;
  titre: string;
  fichierUrl: string;
  dateDepot: string;
  version: number;
}

export interface LettreDTO {
  id?: number;
  titre: string;
  contenu?: string;
  fichierUrl?: string;
  dateDepot: string;
  version: number;
}

export interface ExperienceDTO {
  id?: number;
  poste: string;
  entreprise: string;
  dateDebut: string; // ISO string
  dateFin: string;   // ISO string
  description?: string;
}

export interface CompetenceDTO {
  id?: number;
  libelle: string;
  niveau: 'DEBUTANT' | 'INTERMEDIAIRE' | 'EXPERT';
}

export interface CompetenceLingustiqueDTO {
  id?: number;
  langue: string;
  niveau: 'DEBUTANT' | 'INTERMEDIAIRE' | 'EXPERT';
}

export interface EmployeurDTO {
  id?: number;
  nom: string;
  typeEntreprise: string;
  emailContact: string;
  telephone: string;
  poste: string;
  adresse: string;
  ville: string;
  pays: string;
}

export interface OffreCountDTO {
  id: number;
  nom: string;
  nombreOffres: number;
}

export interface Notification {
  id: number;
  receiverId: number;
  receiverType: 'CANDIDAT' | 'RECRUTEUR' | 'EMPLOYEUR' | 'ADMIN';
  typeEvenement: string;
  message: string;
  isRead: boolean;
  timestamp: string;
}

@Injectable({
  providedIn: 'root'
})
export class TalentService {

  constructor(private httpClient: HttpClient) { }

  // ======================
  //  Candidats
  // ======================
  getCandidats(): Observable<CandidatDTO[]> {
    return this.httpClient.get<CandidatDTO[]>(`${environment.backendCandidatHost}`);
  }

  getCandidatById(id: number): Observable<CandidatResponseDTO> {
    return this.httpClient.get<CandidatResponseDTO>(`${environment.backendCandidatHost}/${id}`);
  }

  createCandidat(candidat: CandidatDTO): Observable<CandidatDTO> {
    return this.httpClient.post<CandidatDTO>(`${environment.backendCandidatHost}`, candidat);
  }


  updateCandidatProfile(id: number, candidat: CandidatDTO): Observable<UserProfileDTO> {
    return this.httpClient.put<UserProfileDTO>(`${environment.backendCandidatHost}/${id}`, candidat);
  }

  updateRecruteurProfile(id: number, recruteur: RecruteurDTO): Observable<UserProfileDTO> {
    return this.httpClient.put<UserProfileDTO>(`${environment.backendRecruteurHost}/${id}`, recruteur);
  }

   updateEmployeurProfile(id: number, employeur: EmployeurDTO): Observable<UserProfileDTO> {
    return this.httpClient.put<UserProfileDTO>(`${environment.backendEmployeurHost}/${id}`, employeur);
  }

  updateAdminProfile(id: number, admin: AdminDTO): Observable<UserProfileDTO> {
    return this.httpClient.put<UserProfileDTO>(`${environment.backendRecruteurHost}/admin/${id}`, admin);
  }

  deleteCandidat(id: number): Observable<Object> {
    return this.httpClient.delete(`${environment.backendCandidatHost}/${id}`);
  }

  // ======================
  //  Offres
  // ======================
  getOffres(): Observable<OffreDTO[]> {
    return this.httpClient.get<OffreDTO[]>(`${environment.backendOffreHost}`);
  }

  getOffreById(id: number): Observable<OffreDTO> {
    return this.httpClient.get<OffreDTO>(`${environment.backendOffreHost}/${id}`);
  }

  createOffre(offre: OffreDTO): Observable<Object> {
    return this.httpClient.post(`${environment.backendOffreHost}`, offre);
  }

  updateOffre(id: number, offre: OffreDTO): Observable<OffreDTO> {
    return this.httpClient.put<OffreDTO>(`${environment.backendOffreHost}/${id}`, offre);
  }


  closeOffre(id: number): Observable<Object> {
    return this.httpClient.put(`${environment.backendOffreHost}/${id}/close`, {});
  }

  openOffre(id: number): Observable<Object> {
    return this.httpClient.put(`${environment.backendOffreHost}/${id}/open`, {});
  }

  deleteOffre(id: number): Observable<Object> {
    return this.httpClient.delete(`${environment.backendOffreHost}/${id}`);
  }

  // ======================
  //  Recruteurs
  // ======================
  getRecruteurs(): Observable<RecruteurDTO[]> {
    return this.httpClient.get<RecruteurDTO[]>(`${environment.backendRecruteurHost}`);
  }

  getRecruteurById(id: number): Observable<RecruteurDTO> {
    return this.httpClient.get<RecruteurDTO>(`${environment.backendRecruteurHost}/${id}`);
  }

  createRecruteur(recruteur: RecruteurDTO): Observable<Object> {
    return this.httpClient.post(`${environment.backendRecruteurHost}`, recruteur);
  }

  updateRecruteur(id: number, recruteur: RecruteurDTO): Observable<Object> {
    return this.httpClient.put(`${environment.backendRecruteurHost}/${id}`, recruteur);
  }

  deleteRecruteur(id: number): Observable<Object> {
    return this.httpClient.delete(`${environment.backendRecruteurHost}/${id}`);
  }

  getCandidaturesParStatut(): Observable<StatutCountDTO[]> {
    return this.httpClient.get<StatutCountDTO[]>(`${environment.backendStatHost}/recrutements/candidatures-par-statut`);
  }

  getCandidaturesParMois(): Observable<MonthlyCountDTO[]> {
    return this.httpClient.get<MonthlyCountDTO[]>(`${environment.backendStatHost}/recrutements/candidatures-par-mois`);
  }

  getCompetencesFrequentes(): Observable<CompetenceFrequencyDTO[]> {
    return this.httpClient.get<CompetenceFrequencyDTO[]>(`${environment.backendStatHost}/competences/competences-frequentes`);
  }

  getOffresParEmployeur() {
  return this.httpClient.get<OffreCountDTO[]>(`${environment.backendStatHost}/offres/employeurs`);
}

getOffresParRecruteur() {
  return this.httpClient.get<OffreCountDTO[]>(`${environment.backendStatHost}/offres/recruteurs`);
}


  postuler(dto: PostulerDTO): Observable<ProcessusDTO> {
    return this.httpClient.post<ProcessusDTO>(
      `${environment.backendRecrutementHost}/postuler`,
      dto
    );
  }

  postulerSpontanee(dto: PostulerDTO): Observable<ProcessusDTO> {
    return this.httpClient.post<ProcessusDTO>(
      `${environment.backendRecrutementHost}/spontanee`,
      dto
    );
  }

  // ==========================
// 🌐 Gestion des Employeurs
// ==========================

getEmployeurs(): Observable<EmployeurDTO[]> {
  return this.httpClient.get<EmployeurDTO[]>(`${environment.backendEmployeurHost}`);
}

getEmployeurById(id: number): Observable<EmployeurDTO> {
  return this.httpClient.get<EmployeurDTO>(`${environment.backendEmployeurHost}/${id}`);
}

createEmployeur(employeur: EmployeurDTO): Observable<EmployeurDTO> {
  return this.httpClient.post<EmployeurDTO>(`${environment.backendEmployeurHost}`, employeur);
}

updateEmployeur(id: number, employeur: EmployeurDTO): Observable<EmployeurDTO> {
  return this.httpClient.put<EmployeurDTO>(`${environment.backendEmployeurHost}/${id}`, employeur);
}

deleteEmployeur(id: number): Observable<void> {
  return this.httpClient.delete<void>(`${environment.backendEmployeurHost}/${id}`);
}

getEmployeurByEmail(email: string): Observable<EmployeurDTO> {
  return this.httpClient.get<EmployeurDTO>(`${environment.backendEmployeurHost}/email/${email}`);
}



  // ======================
  //  Compétences
  // ======================
  getCompetences(candidatId: number): Observable<CompetenceDTO[]> {
    return this.httpClient.get<CompetenceDTO[]>(`${environment.backendCompetenceHost}/${candidatId}`);
  }

  addCompetences(candidatId: number, competences: CompetenceDTO[]): Observable<CompetenceDTO[]> {
    return this.httpClient.post<CompetenceDTO[]>(`${environment.backendCompetenceHost}/${candidatId}`, competences);
  }

  deleteCompetence(competenceId: number): Observable<void> {
    return this.httpClient.delete<void>(`${environment.backendCompetenceHost}/${competenceId}`);
  }

   updateCompetencesLinguistiques(candidatId: number, competences: CompetenceLingustiqueDTO[]): Observable<void> {
    return this.httpClient.put<void>(`${environment.backendCompetenceLinguistiqueHost}/${candidatId}`, competences);
  }

  // ======================
  //  Expériences
  // ======================
  getExperiences(candidatId: number): Observable<ExperienceDTO[]> {
    return this.httpClient.get<ExperienceDTO[]>(`${environment.backendExperienceHost}/${candidatId}`);
  }

  addExperiences(candidatId: number, experiences: ExperienceDTO[]): Observable<ExperienceDTO[]> {
    return this.httpClient.post<ExperienceDTO[]>(`${environment.backendExperienceHost}/${candidatId}`, experiences);
  }


  deleteExperience(experienceId: number): Observable<void> {
    return this.httpClient.delete<void>(`${environment.backendExperienceHost}/${experienceId}`);
  }

  // ======================
  //  CV
  // ======================
  getCvs(candidatId: number): Observable<CvDTO[]> {
    return this.httpClient.get<CvDTO[]>(`${environment.backendCvHost}/${candidatId}`);
  }

  uploadCv(candidatId: number, file: File, titre: string): Observable<CvDTO> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('titre', titre);
    return this.httpClient.post<CvDTO>(`${environment.backendCvHost}/${candidatId}`, formData);
  }

  deleteCv(cvId: number): Observable<void> {
    return this.httpClient.delete<void>(`${environment.backendCvHost}/${cvId}`);
  }

 replaceCv(cvId: number, file: File, titre: string): Observable<CvDTO> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('titre', titre);
    return this.httpClient.put<CvDTO>(`${environment.backendCvHost}/${cvId}/replace`, formData);
  }


  // ======================
  //  Lettres de motivation
  // ======================
  getLettres(candidatId: number): Observable<LettreDTO[]> {
    return this.httpClient.get<LettreDTO[]>(`${environment.backendLettreHost}/${candidatId}/lettres`);
  }

  uploadLettre(candidatId: number, file: File, titre: string): Observable<LettreDTO> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('titre', titre);
    return this.httpClient.post<LettreDTO>(`${environment.backendLettreHost}/${candidatId}/upload`, formData);
  }



  replaceLettre(lettreId: number, file: File, titre: string): Observable<LettreDTO> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('titre', titre);
    return this.httpClient.put<LettreDTO>(`${environment.backendLettreHost}/${lettreId}/replace`, formData);
  }

  deleteLettre(lettreId: number): Observable<void> {
    return this.httpClient.delete<void>(`${environment.backendLettreHost}/${lettreId}`);
  }

  // ======================
  //  Recrutements / Processus
  // ======================
  getAllProcessus(): Observable<ProcessusDTO[]> {
    return this.httpClient.get<ProcessusDTO[]>(`${environment.backendRecrutementHost}`);
  }

  getProcessusByCandidat(candidatId: number): Observable<ProcessusDTO[]> {
    return this.httpClient.get<ProcessusDTO[]>(`${environment.backendRecrutementHost}/candidat/${candidatId}`);
  }

  getProcessusByOffre(offreId: number): Observable<ProcessusDTO[]> {
    return this.httpClient.get<ProcessusDTO[]>(`${environment.backendRecrutementHost}/offre/${offreId}`);
  }

  changerStatut(processusId: number, nouveauStatut: string): Observable<ProcessusDTO> {
    return this.httpClient.put<ProcessusDTO>(
      `${environment.backendRecrutementHost}/${processusId}/statut?nouveauStatut=${nouveauStatut}`,
      {}
    );
  }

  getHistorique(processusId: number): Observable<HistoriqueDTO[]> {
    return this.httpClient.get<HistoriqueDTO[]>(`${environment.backendRecrutementHost}/${processusId}/historique`);
  }

  downloadCv(cvId: number): Observable<HttpResponse<Blob>> {
    return this.httpClient.get(`${environment.backendCvHost}/download/${cvId}`, {
      responseType: 'blob',
      observe: 'response'
    });
  }

  downloadLettre(lettreId: number): Observable<HttpResponse<Blob>> {
    return this.httpClient.get(`${environment.backendLettreHost}/download/${lettreId}`, {
      observe: 'response',
      responseType: 'blob'
    });
  }

  // ======================
  //  Métadonnées RH
  // ======================
  getMetadonneesRH(): Observable<MetadonneeRHDTO[]> {
    return this.httpClient.get<MetadonneeRHDTO[]>(`${environment.backendMetadonneeRhHost}/spontanees`);
  }

  getMetadonneeRHById(candidatId: number): Observable<MetadonneeRHDTO> {
    return this.httpClient.get<MetadonneeRHDTO>(`${environment.backendMetadonneeRhHost}/${candidatId}`);
  }

  addMetadonneeRH(candidatId: number, dto: MetadonneeRHDTO): Observable<MetadonneeRHDTO> {
    return this.httpClient.post<MetadonneeRHDTO>(
      `${environment.backendMetadonneeRhHost}/${candidatId}`,
      dto
    );
  }


updateMetadonneeRH(candidatId: number, dto: MetadonneeRHDTO): Observable<MetadonneeRHDTO> {
  return this.httpClient.put<MetadonneeRHDTO>(
    `${environment.backendMetadonneeRhHost}/${candidatId}`,
    dto
  );
}


  deleteMetadonneeRH(id: number): Observable<void> {
    return this.httpClient.delete<void>(`${environment.backendMetadonneeRhHost}/${id}`);
  }

  lierCandidatureSpontanee(processusId: number, offreId: number): Observable<ProcessusDTO> {
    return this.httpClient.put<ProcessusDTO>(
      `${environment.backendRecrutementHost}/${processusId}/lier-offre/${offreId}`,
      {}
    );
  }

  getMyProfile(): Observable<UserProfileDTO> {
    return this.httpClient.get<UserProfileDTO>(`${environment.backendUtilisateurdHost}/me`);
  }

  // ======================
  // Compétences Linguistiques
  // ======================

  getCompetencesLinguistiques(candidatId: number): Observable<CompetenceLingustiqueDTO[]> {
    return this.httpClient.get<CompetenceLingustiqueDTO[]>(
      `${environment.backendCompetenceLinguistiqueHost}/${candidatId}`
    );
  }

  addCompetencesLinguistiques(candidatId: number, competences: CompetenceLingustiqueDTO[]): Observable<CompetenceLingustiqueDTO[]> {
    return this.httpClient.post<CompetenceLingustiqueDTO[]>(
      `${environment.backendCompetenceLinguistiqueHost}/${candidatId}`,
      competences
    );
  }

  deleteCompetenceLinguistique(id: number): Observable<void> {
    return this.httpClient.delete<void>(
      `${environment.backendCompetenceLinguistiqueHost}/${id}`
    );
  }

  getCandidatsByRecruteur(recruteurId: number): Observable<CandidatDTO[]> {
    return this.httpClient.get<number[]>(`${environment.backendRecrutementHost}/recruteur/${recruteurId}/candidats`).pipe(
      switchMap((candidatIds: number[]) =>
        this.httpClient.post<CandidatDTO[]>(`${environment.backendCandidatHost}/ids`, candidatIds)
      )
    );
  }

  getRecruteurIdByEmail(email: string): Observable<number> {
    return this.httpClient.get<number>(`${environment.backendRecruteurHost}/email/${email}/id`);
  }

    getEmployeurIdByEmail(email: string): Observable<number> {
    return this.httpClient.get<number>(`${environment.backendEmployeurHost}/email/${email}/id`);
  }

  getCandidatByEmail(email: string): Observable<CandidatResponseDTO> {
    return this.httpClient.get<CandidatResponseDTO>(`${environment.backendCandidatHost}/email/${email}`);
  }
  
  // Vérifie si le candidat a déjà postulé à une offre
hasAlreadyApplied(candidatId: number, offreId: number) {
  return this.httpClient.get<boolean>(`${environment.backendRecrutementHost}/existe/${candidatId}/${offreId}`);
}


getUnreadNotifications(userId: number, type: 'CANDIDAT' | 'RECRUTEUR' | 'EMPLOYEUR' | 'ADMIN'): Observable<Notification[]> {
  const params = new HttpParams().set('receiverType', type); // ✅ correspond à @RequestParam("receiverType")
  return this.httpClient.get<Notification[]>(
    `${environment.backendNotificationHost}/user/${userId}/unread`,
    { params }
  );
}


markAsRead(notificationId: number): Observable<void> {
  return this.httpClient.patch<void>(
    `${environment.backendNotificationHost}/${notificationId}/read`,
    {} // corps vide pour PATCH
  );
}

}
