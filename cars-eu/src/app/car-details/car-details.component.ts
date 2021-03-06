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
import { UserService } from '../core/user.service';

@Component({
  encapsulation: ViewEncapsulation.ShadowDom,
  selector: 'app-car-details',
  templateUrl: './car-details.component.html',
  styleUrls: ['./car-details.component.css'],
})
export class CarDetailsComponent implements OnInit {
  public car: object;
  public voted: boolean;
  public isOwnedBy: boolean;
  public isInFavorites: boolean;
  public isLogged: any;
  public id: string;
  public stars: string;
  constructor(
    public carService: CarService,
    public route: ActivatedRoute,
    public router: Router,
    public formBuilder: FormBuilder,
    public userService: UserService,
    private notifications: NotificationsService,
    private spinner: NgxSpinnerService
  ) {
    this.isLogged = localStorage.getItem('id');
    this.id = this.route.snapshot.params['id'];
  }

  commentFormGroup: FormGroup = this.formBuilder.group({
    comment: new FormControl('', [Validators.required]),
  });

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
        this.voted = e['voted'];
        this.isOwnedBy = e['isOwnedBy'];
        this.isInFavorites = e['isInFavorites'];
      },
      complete: () => {
        this.stars = this.carService.starsGenerator(this.car['rating']);
        this.spinner.hide();
      },
      error: (err) => {
        this.notifications.showError(err.error.error);
        this.spinner.hide();
      },
    });
  }

  handleDelete(): void {
    this.spinner.show();
    this.carService.delete$(this.id).subscribe({
      next: (e) => {
        if (!!e['error']) {
          this.spinner.hide();
          this.router.navigate(['/404']);
          return;
        }
        this.notifications.showSuccess('Car deleted successfully!');
        this.router.navigate(['/all-cars']);
        this.spinner.hide();
      },
      error: (err) => {
        this.notifications.showError(err.error.error);
        this.spinner.hide();
      },
    });
  }

  handleLike(): void {
    this.spinner.show();
    this.carService.voteUp$(this.id).subscribe({
      next: (e) => {
        if (!!e['error']) {
          this.spinner.hide();
          this.router.navigate(['/404']);
          return;
        }
        this.stars = this.carService.starsGenerator(this.car['rating'] + 1);
        this.car['rating'] += 1;
        this.voted = true;
        this.notifications.showSuccess('Car liked!');
        this.spinner.hide();
      },
      error: (err) => {
        this.notifications.showError(err.error.error);
        this.spinner.hide();
      },
    });
  }

  handleDislike(): void {
    this.spinner.show();
    this.carService.voteDown$(this.id).subscribe({
      next: (e) => {
        if (!!e['error']) {
          this.spinner.hide();
          this.router.navigate(['/404']);
          return;
        }
        this.stars = this.carService.starsGenerator(this.car['rating'] - 1);
        this.car['rating'] -= 1;
        this.voted = true;
        this.notifications.showSuccess('Car disliked!');
        this.spinner.hide();
      },
      error: (err) => {
        this.notifications.showError(err.error.error);
        this.spinner.hide();
      },
    });
  }

  handleFavorite(): void {
    this.spinner.show();
    this.carService.favorite$(this.id).subscribe({
      next: (e) => {
        if (!!e['error']) {
          this.spinner.hide();
          this.router.navigate(['/404']);
          return;
        }
        this.notifications.showSuccess('Car added to favorites!');
        this.isInFavorites = true;
        this.spinner.hide();
      },
      error: (err) => {
        this.notifications.showError(err.error.error);
        this.spinner.hide();
      },
    });
  }

  handleComment(): void {
    this.spinner.show();

    // front-end validations
    if (
      this.commentFormGroup.value['comment'].trim() === '' ||
      this.commentFormGroup.get('comment')?.hasError('required')
    ) {
      this.notifications.showInfo('Cannot post empty comments.');
      this.commentFormGroup.get('comment')?.setValue('');
      this.spinner.hide();
      return;
    }
    this.carService.comment$(this.id, this.commentFormGroup.value).subscribe();
    let commentingPerson: string;

    this.userService.getProfile$().subscribe({
      next: (e) => {
        commentingPerson = `${e['firstName']} ${e['lastName']}: `;
        this.car['comments'].unshift(
          `${commentingPerson}${this.commentFormGroup.value['comment']}`
        );
        this.notifications.showSuccess('Comment added!');
      },
      complete: () => {
        this.commentFormGroup.get('comment')?.setValue('');
        this.spinner.hide();
      },
      error: (err) => {
        //back-end validation
        this.notifications.showError(err.error.error);
        this.spinner.hide();
      },
    });
  }
}
