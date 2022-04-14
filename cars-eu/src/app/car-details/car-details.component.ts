import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CarService } from '../car.service';

@Component({
  encapsulation: ViewEncapsulation.ShadowDom,
  selector: 'app-car-details',
  templateUrl: './car-details.component.html',
  styleUrls: ['./car-details.component.css'],
})
export class CarDetailsComponent implements OnInit {
  public car: object;
  public voted: object;
  public isOwnedBy: object;
  public isInFavorites: object;
  public isLogged: any;
  constructor(public carService: CarService, public route: ActivatedRoute) {}

  ngOnInit(): void {
    this.isLogged = localStorage.getItem('id');
    let id = this.route.snapshot.params['id'];
    this.carService.getOne$(id).subscribe((e) => {
      this.car = e['car'];
      this.voted = e['voted'];
      this.isOwnedBy = e['isOwnedBy'];
      this.isInFavorites = e['isInFavorites'];
    });
  }
}
