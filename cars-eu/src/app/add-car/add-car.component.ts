import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { CarService } from '../car.service';
import { ICar } from '../core/interfaces/car';
import { NotificationsService } from '../core/notifications.service';

@Component({
  encapsulation: ViewEncapsulation.ShadowDom,
  selector: 'app-add-car',
  templateUrl: './add-car.component.html',
  styleUrls: ['./add-car.component.css'],
})
export class AddCarComponent implements OnInit {
  addFormGroup: FormGroup = this.formBuilder.group({
    brand: new FormControl(null, [
      Validators.required,
      Validators.minLength(3),
    ]),
    model: new FormControl(null, [
      Validators.required,
      Validators.minLength(2),
    ]),
    imgUrl: new FormControl(null, [
      Validators.required,
      Validators.pattern(/^https?:\/\//i),
    ]),
    fuelType: new FormControl(null, [
      Validators.required,
      Validators.minLength(3),
    ]),
    year: new FormControl(null, [
      Validators.required,
      Validators.min(1960),
      Validators.max(2022),
    ]),
    description: new FormControl(null, [
      Validators.required,
      Validators.minLength(8),
    ]),
    mileage: new FormControl(null, [
      Validators.required,
      Validators.min(0),
      Validators.max(500000),
    ]),
    price: new FormControl(null, [
      Validators.required,
      Validators.min(0),
      Validators.max(999999999999),
    ]),
  });
  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private carService: CarService,
    private notifications: NotificationsService,
    private spinner: NgxSpinnerService
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

    //front-end validations
    if (
      this.addFormGroup.get('brand')?.hasError('required') ||
      this.addFormGroup.get('model')?.hasError('required') ||
      this.addFormGroup.get('imgUrl')?.hasError('required') ||
      this.addFormGroup.get('fuelType')?.hasError('required') ||
      this.addFormGroup.get('description')?.hasError('required') ||
      this.addFormGroup.get('mileage')?.hasError('required') ||
      this.addFormGroup.get('price')?.hasError('required') ||
      this.addFormGroup.get('year')?.hasError('required')
    ) {
      this.notifications.showError('All fields are required!');
      return;
    }
    if (this.addFormGroup.get('brand')?.hasError('minlength')) {
      this.notifications.showError(
        'The name of the brand should be at least 3 characters!'
      );
      return;
    }
    if (this.addFormGroup.get('model')?.hasError('minlength')) {
      this.notifications.showError(
        'The name of the model should be at least 2 characters!'
      );
      return;
    }
    if (this.addFormGroup.get('fuelType')?.hasError('minlength')) {
      this.notifications.showError(
        'The fuel type should be at least 3 characters!'
      );
      return;
    }
    if (
      this.addFormGroup.get('year')?.hasError('min') ||
      this.addFormGroup.get('year')?.hasError('max')
    ) {
      this.notifications.showError(
        'Please provide a year between 1960 and 2022!'
      );
      return;
    }
    if (this.addFormGroup.get('imgUrl')?.hasError('pattern')) {
      this.notifications.showError(
        'The car image should start with http:// or https://'
      );
      return;
    }
    if (this.addFormGroup.get('description')?.hasError('minlength')) {
      this.notifications.showError(
        'The description should be a minimum of 8 characters long!'
      );
      return;
    }
    if (
      this.addFormGroup.get('mileage')?.hasError('min') ||
      this.addFormGroup.get('mileage')?.hasError('max')
    ) {
      this.notifications.showError(
        'Please provide a mileage between 0 and 500000!'
      );
      return;
    }
    if (
      this.addFormGroup.get('price')?.hasError('min') ||
      this.addFormGroup.get('price')?.hasError('max')
    ) {
      this.notifications.showError(
        'Please provide a price between 0 and 999999999999!'
      );
      return;
    }
    this.spinner.show();

    const body: ICar = {
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
        this.spinner.hide();
        this.router.navigate(['/all-cars']);
        this.notifications.showSuccess('Car created successfully!');
      },
      error: (err) => {
        //back-end validation
        this.notifications.showError(err.error.error);
        this.spinner.hide();
      },
    });
  }
}
