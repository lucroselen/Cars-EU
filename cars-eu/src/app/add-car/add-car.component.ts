import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { CarService } from '../car.service';
import { NotificationsService } from '../core/notifications.service';

@Component({
  encapsulation: ViewEncapsulation.ShadowDom,
  selector: 'app-add-car',
  templateUrl: './add-car.component.html',
  styleUrls: ['./add-car.component.css'],
})
export class AddCarComponent implements OnInit {
  addFormGroup: FormGroup = this.formBuilder.group({
    brand: new FormControl(null, [Validators.required]),
    model: new FormControl(null, [Validators.required]),
    imgUrl: new FormControl(null, [
      Validators.required,
      Validators.minLength(5),
    ]),
    fuelType: new FormControl(null, [
      Validators.required,
      Validators.minLength(3),
    ]),
    year: new FormControl(null, [Validators.required, Validators.minLength(4)]),
    description: new FormControl(null, [
      Validators.required,
      Validators.minLength(10),
    ]),
    mileage: new FormControl(null, [Validators.required]),
    price: new FormControl(null, [Validators.required]),
  });
  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private carService: CarService,
    private notifications: NotificationsService
  ) {}

  ngOnInit(): void {}
  handleAdd(): void {
    let creator = localStorage.getItem('id');
    const {
      brand,
      model,
      imgUrl,
      fuelType,
      year,
      description,
      mileage,
      price,
    } = this.addFormGroup.value;

    const body: object = {
      brand,
      model,
      imgUrl,
      fuelType,
      year,
      description,
      mileage,
      price,
      creator,
    };
    this.carService.add$(body).subscribe({
      next: () => {
        this.router.navigate(['/all-cars']);
      },
    });
  }
}
