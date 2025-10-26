import { Component, Input, OnInit } from '@angular/core';
import { Notification, TalentService } from '../services/talent.service';
import { AuthService } from '../services/auth.service';
import { trigger, transition, style, animate } from '@angular/animations';

type UserRole = 'CANDIDAT' | 'RECRUTEUR' | 'EMPLOYEUR' | 'ADMIN';

@Component({
  selector: 'app-notification-bell',
  standalone: false,
  templateUrl: './notification-bell.component.html',
  styleUrls: ['./notification-bell.component.css'],
  animations: [
    trigger('dropdownAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(-8px)' }),
        animate('180ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ]),
      transition(':leave', [
        animate('120ms ease-in', style({ opacity: 0, transform: 'translateY(-8px)' }))
      ])
    ])
  ]
})
export class NotificationBellComponent implements OnInit {
  userId!: number;
  role!: UserRole;
  unreadCount = 0;
  notifications: Notification[] = [];
  dropdownOpen = false;

  constructor(
    private talentService: TalentService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.setUserFromToken();
    this.loadNotifications();

    // ✅ Rafraîchit automatiquement toutes les 15 secondes
    setInterval(() => this.loadNotifications(), 15000);
  }

  setUserFromToken(): void {
    const user = this.authService.getCurrentUser();

    if (user?.id) {
      this.userId = user.id;
      const role = user.roles?.[0] || '';
      this.role = role.replace('ROLE_', '') as UserRole;
    }
  }

  loadNotifications(): void {
    if (!this.userId || !this.role) return;

    this.talentService.getUnreadNotifications(this.userId, this.role)
      .subscribe({
        next: (notifs) => {
          this.notifications = notifs;
          this.unreadCount = notifs.filter(n => !n.isRead).length;
        },
        error: (err) => console.error('Erreur chargement notifications', err)
      });
  }

  toggleDropdown(): void {
    this.dropdownOpen = !this.dropdownOpen;
  }

  markAsRead(notification: Notification): void {
    if (!notification.id || notification.isRead) return;

    this.talentService.markAsRead(notification.id).subscribe({
      next: () => {
        notification.isRead = true;
        this.unreadCount = Math.max(this.unreadCount - 1, 0);
      },
      error: (err) => console.error('Erreur mise à jour notification', err)
    });
  }
}
