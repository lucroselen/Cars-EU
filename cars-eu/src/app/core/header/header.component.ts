import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  private isLoggingOut: boolean = false;
  constructor(public authService: AuthService, private router: Router) {}

  ngOnInit(): void {}

  logoutHandler(): void {
    if (this.isLoggingOut) {
      return;
    }

    this.isLoggingOut = true;

    this.authService.logout$().subscribe({
      next: (args) => {
        console.log(args);
      },
      complete: () => {
        this.isLoggingOut = false;
        this.router.navigate(['/']);
      },
      error: () => {
        this.isLoggingOut = false;
      },
    });
  }
}
