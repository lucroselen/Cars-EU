import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth.guard';
import { GuestGuard } from './guest.guard';
import { LoginComponent } from './login/login.component';
import { ProfileComponent } from './profile/profile.component';
import { RegisterComponent } from './register/register.component';

const routes: Routes = [
  {
    path: 'register',
    component: RegisterComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'profile',
    component: ProfileComponent,
    canActivate: [GuestGuard],
  },
];

export const AuthRoutingModule = RouterModule.forChild(routes);
