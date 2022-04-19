import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { AuthService } from 'src/app/auth.service';
import { IUser } from 'src/app/core/interfaces/user';
import { NotificationsService } from 'src/app/core/notifications.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
  registerFormGroup: FormGroup = this.formBuilder.group({
    firstName: new FormControl(null, [
      Validators.required,
      Validators.minLength(2),
      Validators.pattern(/^[A-Z][a-z]*$/),
    ]),
    lastName: new FormControl(null, [
      Validators.required,
      Validators.minLength(2),
      Validators.pattern(/^[A-Z][a-z]*$/),
    ]),
    email: new FormControl(
      null,
      Validators.compose([Validators.required, Validators.email])
    ),
    password: new FormControl(
      null,
      Validators.compose([
        Validators.required,
        Validators.minLength(6),
        Validators.pattern(/^[^ ]*$/),
      ])
    ),
    rePassword: new FormControl(null, [
      Validators.required,
      Validators.minLength(6),
    ]),
  });

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private notifications: NotificationsService,
    private spinner: NgxSpinnerService
  ) {}

  ngOnInit(): void {}
  handleRegister(): void {
    const { firstName, lastName, email, password, rePassword } =
      this.registerFormGroup.value;
    //front-end validation
    if (
      this.registerFormGroup.get('email')?.hasError('required') ||
      this.registerFormGroup.get('password')?.hasError('required') ||
      this.registerFormGroup.get('rePassword')?.hasError('required') ||
      this.registerFormGroup.get('firstName')?.hasError('required') ||
      this.registerFormGroup.get('lastName')?.hasError('required')
    ) {
      this.notifications.showError('All fields are required!');
      return;
    }
    if (this.registerFormGroup.get('firstName')?.hasError('pattern')) {
      this.notifications.showError(
        `${firstName} is not a valid first name! Use only latin letters and no white spaces!`
      );
      return;
    }
    if (this.registerFormGroup.get('lastName')?.hasError('pattern')) {
      this.notifications.showError(
        `${lastName} is not a valid last name! Use only latin letters and no white spaces!`
      );
      return;
    }
    if (this.registerFormGroup.get('email')?.hasError('email')) {
      this.notifications.showError('Email address is incorrect format!');
      return;
    }
    if (this.registerFormGroup.get('password')?.hasError('minlength')) {
      this.notifications.showError(
        'Password should be at least 6 characters long!'
      );
      return;
    }
    if (
      this.registerFormGroup.get('password')?.hasError('pattern') ||
      this.registerFormGroup.get('rePassword')?.hasError('pattern')
    ) {
      this.notifications.showError('Password cannot contain white spaces!');
      return;
    }
    if (password != rePassword) {
      this.notifications.showError('Both passwords should be the same!');
      return;
    }
    this.spinner.show();

    const body: IUser = {
      firstName,
      lastName,
      email,
      password,
      rePassword,
    };
    this.authService.register$(body).subscribe({
      next: (e: any) => {
        localStorage.setItem('id', e.id);
        this.authService.authenticate().subscribe();
        this.spinner.hide();
        this.router.navigate(['/all-cars']);
        this.notifications.showSuccess('Registration successful!');
      },
      error: (err) => {
        //back-end validation
        this.spinner.hide();
        this.notifications.showError(err.error.error);
      },
    });
  }
}
