import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { CarService } from '../car.service';
import { NotificationsService } from '../core/notifications.service';

@Component({
  encapsulation: ViewEncapsulation.ShadowDom,
  selector: 'app-edit-car',
  templateUrl: './edit-car.component.html',
  styleUrls: ['./edit-car.component.css'],
})
export class EditCarComponent implements OnInit {
  private id: string;
  public car: object;
  private isOwnedBy: boolean;
  editFormGroup: FormGroup = this.formBuilder.group({
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
    private route: ActivatedRoute,
    private notifications: NotificationsService,
    private spinner: NgxSpinnerService
  ) {
    this.id = this.route.snapshot.params['id'];
  }

  ngOnInit(): void {
    this.spinner.show();
    this.carService.getOne$(this.id).subscribe({
      next: (e) => {
        if (!!e['error']) {
          this.spinner.hide();
          this.router.navigate(['/404']);
          return;
        }
        this.car = e['car'];
        this.isOwnedBy = e['isOwnedBy'];
        if (this.isOwnedBy == false) {
          this.router.navigate([`/details/${this.id}`]);
          this.notifications.showError('You are not the owner of this car!');
          return;
        }
        this.editFormGroup.get('brand')?.setValue(this.car['brand']);
        this.editFormGroup.get('model')?.setValue(this.car['model']);
        this.editFormGroup.get('year')?.setValue(this.car['year']);
        this.editFormGroup.get('imgUrl')?.setValue(this.car['imgUrl']);
        this.editFormGroup.get('fuelType')?.setValue(this.car['fuelType']);
        this.editFormGroup
          .get('description')
          ?.setValue(this.car['description']);
        this.editFormGroup.get('mileage')?.setValue(this.car['mileage']);
        this.editFormGroup.get('price')?.setValue(this.car['price']);
        this.spinner.hide();
      },
      error: (err) => {
        this.notifications.showError(err.error.error);
      },
    });
  }
  handleEdit(): void {
    let creator = this.car['creator'];

    const {
      brand,
      model,
      imgUrl,
      fuelType,
      year,
      description,
      mileage,
      price,
    } = this.editFormGroup.value;
    //front-end validations
    if (
      this.editFormGroup.get('brand')?.hasError('required') ||
      this.editFormGroup.get('model')?.hasError('required') ||
      this.editFormGroup.get('imgUrl')?.hasError('required') ||
      this.editFormGroup.get('fuelType')?.hasError('required') ||
      this.editFormGroup.get('description')?.hasError('required') ||
      this.editFormGroup.get('mileage')?.hasError('required') ||
      this.editFormGroup.get('price')?.hasError('required') ||
      this.editFormGroup.get('year')?.hasError('required')
    ) {
      this.notifications.showError('All fields are required!');
      return;
    }
    if (this.editFormGroup.get('brand')?.hasError('minlength')) {
      this.notifications.showError(
        'The name of the brand should be at least 3 characters!'
      );
      return;
    }
    if (this.editFormGroup.get('model')?.hasError('minlength')) {
      this.notifications.showError(
        'The name of the model should be at least 2 characters!'
      );
      return;
    }
    if (this.editFormGroup.get('fuelType')?.hasError('minlength')) {
      this.notifications.showError(
        'The fuel type should be at least 3 characters!'
      );
      return;
    }
    if (
      this.editFormGroup.get('year')?.hasError('min') ||
      this.editFormGroup.get('year')?.hasError('max')
    ) {
      this.notifications.showError(
        'Please provide a year between 1960 and 2022!'
      );
      return;
    }
    if (this.editFormGroup.get('imgUrl')?.hasError('pattern')) {
      this.notifications.showError(
        'The car image should start with http:// or https://'
      );
      return;
    }
    if (this.editFormGroup.get('description')?.hasError('minlength')) {
      this.notifications.showError(
        'The description should be a minimum of 8 characters long!'
      );
      return;
    }
    if (
      this.editFormGroup.get('mileage')?.hasError('min') ||
      this.editFormGroup.get('mileage')?.hasError('max')
    ) {
      this.notifications.showError(
        'Please provide a mileage between 0 and 500000!'
      );
      return;
    }
    if (
      this.editFormGroup.get('price')?.hasError('min') ||
      this.editFormGroup.get('price')?.hasError('max')
    ) {
      this.notifications.showError(
        'Please provide a price between 0 and 999999999999!'
      );
      return;
    }
    this.spinner.show();

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
    this.carService.edit$(body, this.id).subscribe({
      next: () => {
        this.spinner.hide();
        this.router.navigate([`/details/${this.id}`]);
        this.notifications.showSuccess('Car edited successfully!');
      },
      error: (err) => {
        //back-end validation
        this.notifications.showError(err.error.error);
      },
    });
  }
}
