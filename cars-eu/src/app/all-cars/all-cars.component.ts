import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { CarService } from '../car.service';
import { NotificationsService } from '../core/notifications.service';

@Component({
  selector: 'app-all-cars',
  templateUrl: './all-cars.component.html',
  styleUrls: ['./all-cars.component.css'],
})
export class AllCarsComponent implements OnInit {
  public cars: [];
  constructor(
    private carService: CarService,
    private notifications: NotificationsService,
    private spinner: NgxSpinnerService
  ) {}

  ngOnInit(): void {
    this.spinner.show();
    this.notifications.showInfo('All cars are being displayed!');
    this.carService.allCars$().subscribe((e) => {
      this.cars = e['cars'].map((e) => {
        e.stars = this.carService.starsGenerator(e.rating);
        return e;
      });
      this.spinner.hide();
    });
  }
}
