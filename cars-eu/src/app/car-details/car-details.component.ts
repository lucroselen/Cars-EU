import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { subscribeOn, tap } from 'rxjs';
import { CarService } from '../car.service';
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
    public userService: UserService
  ) {
    this.isLogged = localStorage.getItem('id');
    this.id = this.route.snapshot.params['id'];
  }

  commentFormGroup: FormGroup = this.formBuilder.group({
    comment: new FormControl('', [Validators.required]),
  });

  ngOnInit(): void {
    this.carService.getOne$(this.id).subscribe({
      next: (e) => {
        if (!!e['error']) {
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
      },
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

  handleLike(): void {
    this.carService.voteUp$(this.id).subscribe((e) => {
      if (!!e['error']) {
        this.router.navigate(['/404']);
        return;
      }
      this.stars = this.carService.starsGenerator(this.car['rating'] + 1);
      this.car['rating'] += 1;
      this.voted = true;
    });
  }

  handleDislike(): void {
    this.carService.voteDown$(this.id).subscribe((e) => {
      if (!!e['error']) {
        this.router.navigate(['/404']);
        return;
      }
      this.stars = this.carService.starsGenerator(this.car['rating'] - 1);
      this.car['rating'] -= 1;
      this.voted = true;
    });
  }

  handleFavorite(): void {
    this.carService.favorite$(this.id).subscribe((e) => {
      if (!!e['error']) {
        this.router.navigate(['/404']);
        return;
      }
      this.isInFavorites = true;
    });
  }

  handleComment(): void {
    if (this.commentFormGroup.value['comment'].trim() === '') {
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
      },
      complete: () => {
        this.commentFormGroup.get('comment')?.setValue('');
      },
    });
  }
}
