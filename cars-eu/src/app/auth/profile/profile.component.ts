import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { AuthService } from 'src/app/auth.service';

@Component({
  encapsulation: ViewEncapsulation.ShadowDom,
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit {
  person: any;
  currentUser$: any;
  constructor(public authService: AuthService) {}

  ngOnInit(): void {
    this.currentUser$ = this.authService.currentUser$.subscribe((e) => {
      this.person = e;
    });
  }
}
