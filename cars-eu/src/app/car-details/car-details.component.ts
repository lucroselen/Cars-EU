import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
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
  public id: string;
  constructor(
    public carService: CarService,
    public route: ActivatedRoute,
    public router: Router
  ) {
    this.isLogged = localStorage.getItem('id');
    this.id = this.route.snapshot.params['id'];
  }

  ngOnInit(): void {
    this.carService.getOne$(this.id).subscribe((e) => {
      if (!!e['error']) {
        this.router.navigate(['/404']);
        return;
      }
      this.car = e['car'];
      this.voted = e['voted'];
      this.isOwnedBy = e['isOwnedBy'];
      this.isInFavorites = e['isInFavorites'];
    });
  }

  handleDelete(): void {
    this.carService.delete$(this.id).subscribe((e) => {
      if (!!e['error']) {
        this.router.navigate(['/404']);
        return;
      }
      this.router.navigate(['/all-cars']);
    });
  }
}
