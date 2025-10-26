import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { AuthService } from '../../services/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnakBarComponent } from '../../shared/snak-bar/snak-bar.component';

@Component({
  selector: 'app-login-register',
  standalone: false,
  templateUrl: './login-register.component.html',
  styleUrls: ['./login-register.component.css']
})
export class LoginRegisterComponent {
  mode: 'login' | 'register' = 'login';
  form: FormGroup;
  loading = false;

  constructor(
    private dialogRef: MatDialogRef<LoginRegisterComponent>,
    private fb: FormBuilder,
    private authService: AuthService,
    private snackBar: MatSnackBar // ✅ on injecte le service, pas ton composant
  ) {
    this.form = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
      email: [''],
      role: ['CANDIDAT']
    });
  }

  toggleMode() {
    this.mode = this.mode === 'login' ? 'register' : 'login';
  }

  submit() {
    if (this.form.invalid) return;
    this.loading = true;

    if (this.mode === 'login') {
      const { username, password } = this.form.value;

      this.authService.login(username, password).subscribe({
        next: () => {
          this.loading = false;
          this.openSnack('Connexion réussie ✅', 'success');
          this.dialogRef.close('success');
        },
        error: () => {
          this.loading = false;
          this.openSnack('Identifiants invalides ❌', 'error');
        }
      });
    } else {
      const { username, password, email, role } = this.form.value;

      this.authService.register(username, email, password, role).subscribe({
        next: (res: any) => {
          this.loading = false;
          const message = res?.message || 'Compte créé avec succès 🎉';
          this.openSnack(message, 'success');
          this.toggleMode();
        },
        error: (err: any) => {
          this.loading = false;
          const backendMessage =
            err?.error?.message ||
            err?.error ||
            'Erreur lors de l’inscription ❌';
          this.openSnack(backendMessage, 'error');
        }
      });
    }
  }

  /** ✅ Méthode utilitaire pour afficher ton SnakBarComponent personnalisé */
  openSnack(message: string, type: 'success' | 'error') {
    this.snackBar.openFromComponent(SnakBarComponent, {
      data: { message, type },
      duration: 4000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
      panelClass: type === 'success' ? ['snackbar-success'] : ['snackbar-error']
    });
  }

  close() {
    this.dialogRef.close('cancel');
  }
}
