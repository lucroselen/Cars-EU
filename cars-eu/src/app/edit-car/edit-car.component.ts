import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
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
    brand: new FormControl('', [Validators.required]),
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
    private route: ActivatedRoute,
    private notifications: NotificationsService
  ) {
    this.id = this.route.snapshot.params['id'];
  }

  ngOnInit(): void {
    this.carService.getOne$(this.id).subscribe((e) => {
      if (!!e['error']) {
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
      this.editFormGroup.get('description')?.setValue(this.car['description']);
      this.editFormGroup.get('mileage')?.setValue(this.car['mileage']);
      this.editFormGroup.get('price')?.setValue(this.car['price']);
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
        this.router.navigate([`/details/${this.id}`]);
      },
    });
  }
}
