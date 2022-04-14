import { Component, OnInit } from '@angular/core';
import { CarService } from '../car.service';

@Component({
  selector: 'app-top-10',
  templateUrl: './top-10.component.html',
  styleUrls: ['./top-10.component.css'],
})
export class Top10Component implements OnInit {
  public cars: [];
  constructor(private carService: CarService) {}

  ngOnInit(): void {
    this.carService.top10Cars$().subscribe((e) => {
      this.cars = e['cars'];
    });
  }
}
