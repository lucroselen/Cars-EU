import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth.service';
import { NotificationsService } from '../notifications.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  person: any;
  currentUser$: any;

  private isLoggingOut: boolean = false;
  constructor(
    public authService: AuthService,
    private router: Router,
    private notifications: NotificationsService
  ) {}

  ngOnInit(): void {
    this.currentUser$ = this.authService.currentUser$.subscribe((e) => {
      this.person = e;
    });
  }

  logoutHandler(): void {
    if (this.isLoggingOut) {
      return;
    }

    this.isLoggingOut = true;

    this.authService.logout$().subscribe({
      complete: () => {
        this.isLoggingOut = false;
        this.router.navigate(['/user/login']);
        this.authService.handleLogout();
        localStorage.removeItem('id');
        this.notifications.showSuccess('Logout successful!');
      },
      error: () => {
        this.isLoggingOut = false;
      },
    });
  }
}
