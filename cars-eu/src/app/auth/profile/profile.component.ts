import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { NotificationsService } from 'src/app/core/notifications.service';
import { UserService } from 'src/app/core/user.service';

@Component({
  encapsulation: ViewEncapsulation.ShadowDom,
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit {
  person: any;
  constructor(
    public userService: UserService,
    private notifications: NotificationsService,
    private spinner: NgxSpinnerService
  ) {}

  ngOnInit(): void {
    this.spinner.show();
    this.userService.getProfile$().subscribe({
      next: (e) => {
        this.person = e;
        this.spinner.hide();
      },
      error: (err) => {
        this.notifications.showError(err.error.error);
        this.spinner.hide();
      },
    });
  }
}
