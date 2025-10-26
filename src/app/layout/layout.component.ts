import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { LoginComponent } from '../auth/login/login.component';
import { LoginRegisterComponent } from '../auth/login-register/login-register.component';
import { TalentService } from '../services/talent.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnakBarComponent } from '../shared/snak-bar/snak-bar.component';

@Component({
  selector: 'app-layout',
  standalone: false,
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css'
})
export class LayoutComponent {
  isAdmin = false;
  isRecruteur = false;
  currentUserName: string | null = null;
  isCandidat = false;
  currentUserId!: number;

  constructor(

    private dialog: MatDialog,
    private authService: AuthService,
    private talentService: TalentService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.setRoles(); // Appelle la méthode au chargement
    this.loadUserProfile();
  }
  setRoles(): void {
    const roles = this.authService.getUserRoles();
    this.isAdmin = roles.includes('ROLE_ADMIN');
    this.isRecruteur = roles.includes('ROLE_RECRUTEUR');
    this.isCandidat = roles.includes('ROLE_CANDIDAT');
  }

  openLoginPopup() {
    const dialogRef = this.dialog.open(LoginRegisterComponent, {
      width: '420px',
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'success') {
        this.setRoles(); // met à jour les rôles après login
        this.loadUserProfile();
       
        // revenir au home après login
        this.router.navigate(['/home']);
      }
    });
  }

  logout(): void {
    this.authService.logout();
    this.isAdmin = false;
    this.isRecruteur = false;
    this.currentUserName = null;
    this.openSnack('👋 Déconnexion réussie. À bientôt !', 'success');
    this.router.navigate(['/home']);
  }

  isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

loadUserProfile(): void {
  if (this.authService.isLoggedIn()) {
    this.talentService.getMyProfile().subscribe({
      next: (user) => {
        // Nom affiché
        if (user.prenom && user.nom) {
          this.currentUserName = `${user.prenom} ${user.nom}`;
        } else if (user.nom) {
          this.currentUserName = user.nom;
        } else {
          this.currentUserName = user.email;
        }

        // ✅ Ajouter l'ID de l'utilisateur
        this.currentUserId = user.id;
      },
      error: (err) => {
        console.error('Erreur chargement profil utilisateur', err);
        this.currentUserName = null;
      }
    });
  }
}

/** ✅ Méthode utilitaire pour ton snackbar personnalisé */
  openSnack(message: string, type: 'success' | 'error') {
    this.snackBar.openFromComponent(SnakBarComponent, {
      data: { message, type },
      duration: 4000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
      panelClass: type === 'success' ? ['snackbar-success'] : ['snackbar-error']
    });
  }

}
