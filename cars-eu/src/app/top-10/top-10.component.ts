import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { CarService } from '../car.service';
import { NotificationsService } from '../core/notifications.service';

@Component({
  selector: 'app-top-10',
  templateUrl: './top-10.component.html',
  styleUrls: ['./top-10.component.css'],
})
export class Top10Component implements OnInit {
  public cars: [];
  constructor(
    private carService: CarService,
    private notifications: NotificationsService,
    private spinner: NgxSpinnerService
  ) {}

  ngOnInit(): void {
    this.spinner.show();
    this.notifications.showInfo('The top 10 cars are being displayed!');
    this.carService.top10Cars$().subscribe({
      next: (e) => {
        this.cars = e['cars'].map((e) => {
          e.stars = this.carService.starsGenerator(e.rating);
          return e;
        });
        this.spinner.hide();
      },
      error: (err) => {
        this.notifications.showInfo(err.error.error);
        this.spinner.hide();
      },
    });
  }
}
