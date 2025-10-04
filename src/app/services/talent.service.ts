import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
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
  telephone?: string;
  dateNaissance?: string;
  adresse?: string;

  // Pour candidat
  metadonneeRH?: MetadonneeRHDTO;
  cvs?: CvDTO[];
  lettres?: LettreDTO[];
  experiences?: ExperienceDTO[];
  competences?: CompetenceDTO[];

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
  disponibilite?: string;
}

export interface CandidatResponseDTO {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  dateNaissance: string;   //  en JSON ce sera une string (ex: "1990-05-01")
  adresse: string;
  metadonneeRH: MetadonneeRHDTO;

  cvs: CvDTO[];
  lettres: LettreDTO[];
  experiences: ExperienceDTO[];
  competences: CompetenceDTO[];
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
  description: string;
  datePublication?: string; // ISO string pour LocalDateTime
  categorie: string;
  ville: string;
  pays: string;
  active: boolean;
  recruteurId: number;
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
  niveau: 'JUNIOR' | 'INTERMEDIAIRE' | 'SENIOR';
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


  updateCandidat(id: number, candidat: CandidatDTO): Observable<Object> {
    return this.httpClient.put(`${environment.backendCandidatHost}/${id}`, candidat);
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


  updateMetadonneeRH(id: number, dto: MetadonneeRHDTO): Observable<MetadonneeRHDTO> {
    return this.httpClient.put<MetadonneeRHDTO>(`${environment.backendMetadonneeRhHost}/${id}`, dto);
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

}
