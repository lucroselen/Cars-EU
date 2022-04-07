import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth.service';
import { IUser } from 'src/app/core/interfaces/user';

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
    ]),
    lastName: new FormControl(null, [
      Validators.required,
      Validators.minLength(2),
    ]),
    email: new FormControl(null, [Validators.required]),
    password: new FormControl(null, [
      Validators.required,
      Validators.minLength(2),
    ]),
    rePassword: new FormControl(null, [
      Validators.required,
      Validators.minLength(2),
    ]),
  });

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {}
  handleRegister(): void {
    const { firstName, lastName, email, password, rePassword } =
      this.registerFormGroup.value;

    const body: IUser = {
      id: '',
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
      },
      complete: () => {
        this.router.navigate(['/']);
      },
    });
  }
}
