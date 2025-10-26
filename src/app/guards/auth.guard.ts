import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { MatDialog } from '@angular/material/dialog';

import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { LoginComponent } from '../auth/login/login.component';
import { LoginRegisterComponent } from '../auth/login-register/login-register.component';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private authService: AuthService,
    private dialog: MatDialog,
    private router: Router
  ) {}

  canActivate(): Observable<boolean> {
    if (this.authService.isLoggedIn()) {
      return of(true);
    }

    // Si pas connecté → ouvrir le popup de connexion
    const dialogRef = this.dialog.open(LoginRegisterComponent, {
      width: '400px',
      disableClose: true
    });

    return dialogRef.afterClosed().pipe(
      switchMap(result => {
        if (result === 'success') {
          // connexion réussie → autoriser la route
          return of(true);
        } else {
          // sinon → retour à la page d'accueil
          this.router.navigate(['/home']);
          return of(false);
        }
      })
    );
  }
}
