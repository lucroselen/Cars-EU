import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { UserService } from 'src/app/core/user.service';

@Component({
  encapsulation: ViewEncapsulation.ShadowDom,
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit {
  person: any;
  constructor(public userService: UserService) {}

  ngOnInit(): void {
    this.userService.getProfile$().subscribe((e) => {
      this.person = e;
    });
  }
}
