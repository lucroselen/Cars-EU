import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth.service';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  loginFormGroup: FormGroup = this.formBuilder.group({
    email: new FormControl(null, [
      Validators.required,
      Validators.minLength(5),
    ]),
    password: new FormControl(null, [
      Validators.required,
      Validators.minLength(5),
    ]),
  });
  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {}

  handleLogin(): void {
    this.authService.login$(this.loginFormGroup.value).subscribe({
      next: (e: any) => {
        localStorage.setItem('id', e.id);
        this.authService.authenticate().subscribe();
      },
      complete: () => {
        this.router.navigate(['/all-cars']);
      },
    });
  }
}
