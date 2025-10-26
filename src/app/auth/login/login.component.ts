import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  username = '';
  password = '';
  error = '';

  constructor(
    private authService: AuthService,
    private dialogRef: MatDialogRef<LoginComponent>
  ) {}

  login() {
    this.authService.login(this.username, this.password).subscribe({
      next: () => {
        this.dialogRef.close('success');
      },
      error: () => {
        this.error = 'Nom d’utilisateur ou mot de passe incorrect.';
      }
    });
  }
}