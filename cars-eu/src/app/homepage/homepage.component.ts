import { Component, OnInit } from '@angular/core';
import { NotificationsService } from '../core/notifications.service';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css'],
})
export class HomepageComponent implements OnInit {
  person: any;
  constructor(private notifications: NotificationsService) {}

  ngOnInit(): void {
    this.person = localStorage.getItem('id');
    this.notifications.showInfo('Welcome to CARS EU!');
  }
}
