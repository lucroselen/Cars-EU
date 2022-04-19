import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth.service';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { NotificationsService } from 'src/app/core/notifications.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  loginFormGroup: FormGroup = this.formBuilder.group({
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
  });
  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private notifications: NotificationsService,
    private spinner: NgxSpinnerService
  ) {}

  ngOnInit(): void {}

  handleLogin(): void {
    //front-end validation
    if (
      this.loginFormGroup.get('email')?.hasError('required') ||
      this.loginFormGroup.get('password')?.hasError('required')
    ) {
      this.notifications.showError('Both fields are required!');
      return;
    }
    if (this.loginFormGroup.get('email')?.hasError('email')) {
      this.notifications.showError('Email address is incorrect format!');
      return;
    }
    if (this.loginFormGroup.get('password')?.hasError('minlength')) {
      this.notifications.showError(
        'Password should be at least 6 characters long!'
      );
      return;
    }
    if (this.loginFormGroup.get('password')?.hasError('pattern')) {
      this.notifications.showError('Password cannot contain white spaces!');
      return;
    }
    this.spinner.show();

    this.authService.login$(this.loginFormGroup.value).subscribe({
      next: (e: any) => {
        localStorage.setItem('id', e.id);
        this.authService.authenticate().subscribe();
        this.spinner.hide();
        this.router.navigate(['/all-cars']);
        this.notifications.showSuccess('Login successful!');
      },
      error: (err) => {
        //back-end validation
        this.spinner.hide();
        this.notifications.showError(err.error.error);
      },
    });
  }
}
