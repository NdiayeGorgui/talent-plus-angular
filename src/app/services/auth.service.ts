import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { environment } from '../../environments/environment.development';
import { jwtDecode } from 'jwt-decode';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = `${environment.backendUtilisateurdHost}`;

  constructor(private http: HttpClient) {}

  // ✅ Authentification
  login(username: string, password: string) {
    return this.http.post<{ token: string }>(`${this.apiUrl}/login`, { username, password })
      .pipe(
        tap(response => {
          localStorage.setItem('token', response.token);
        })
      );
  }

  // ✅ Déconnexion
  logout() {
    localStorage.removeItem('token');
  }

  // ✅ Récupérer le token JWT
  getToken(): string | null {
    return localStorage.getItem('token');
  }

  // ✅ Vérifier si connecté
  isLoggedIn(): boolean {
    const token = this.getToken();
    if (!token) return false;

    try {
      const decoded: any = jwtDecode(token);
      const exp = decoded.exp * 1000; // conversion en ms
      return Date.now() < exp;
    } catch {
      return false;
    }
  }

  // ✅ Extraire les rôles depuis le token JWT
  getUserRoles(): string[] {
    const token = this.getToken();
    if (!token) return [];

    try {
      const decoded: any = jwtDecode(token);
      return decoded.roles || [];
    } catch {
      return [];
    }
  }

  // ✅ Vérifier si ADMIN
  isAdmin(): boolean {
    return this.getUserRoles().includes('ROLE_ADMIN');
  }

  // ✅ Vérifier si CANDIDAT
  isCandidat(): boolean {
    return this.getUserRoles().includes('ROLE_CANDIDAT');
  }

  // ✅ Récupérer l’email (ou username) du token
  getUsername(): string | null {
    const token = this.getToken();
    if (!token) return null;

    try {
      const decoded: any = jwtDecode(token);
      return decoded.sub || null;
    } catch {
      return null;
    }
  }

  // ✅ Inscription
  register(username: string, email: string, password: string, role: string) {
    return this.http.post(`${this.apiUrl}/register`, {
      username,
      email,
      password,
      role
    });
  }

  // ✅ Récupérer l'ID utilisateur à partir du JWT
getCurrentUserEmail(): string | null {
  const token = localStorage.getItem('token');
  if (!token) return null;

  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    // ✅ on récupère le vrai email s’il existe, sinon le sub
    return payload.email || payload.sub || null;
  } catch (e) {
    console.error("Erreur lors du décodage du token JWT", e);
    return null;
  }
}





  // ✅ Décoder et retourner le payload du JWT
getCurrentUser(): { sub: string; roles: string[]; id?: number } | null {
  const token = localStorage.getItem('token');
  if (!token) return null;

  try {
    const base64Payload = token.split('.')[1];
    const decodedPayload = atob(base64Payload);
    const parsedPayload = JSON.parse(decodedPayload);
    return parsedPayload;
  } catch (e) {
    console.error("Erreur lors du décodage du token JWT :", e);
    return null;
  }
}

// ✅ Nouvelle méthode sécurisée
getCurrentRecruteurId(): number | null {
  const token = localStorage.getItem('token');
  if (!token) return null;

  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.id || null; // ← Utilise 'id' tel qu'il est dans ton JWT
  } catch (e) {
    console.error("Erreur lors du décodage du token JWT :", e);
    return null;
  }
}


}
