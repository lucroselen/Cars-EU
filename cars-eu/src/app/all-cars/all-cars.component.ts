import { Component, OnInit } from '@angular/core';
import { CarService } from '../car.service';

@Component({
  selector: 'app-all-cars',
  templateUrl: './all-cars.component.html',
  styleUrls: ['./all-cars.component.css'],
})
export class AllCarsComponent implements OnInit {
  public cars: [];
  constructor(private carService: CarService) {}

  ngOnInit(): void {
    this.carService.allCars$().subscribe((e) => {
      this.cars = e['cars'];
    });
  }
}
