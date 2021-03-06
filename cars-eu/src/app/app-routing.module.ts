import { RouterModule, Routes } from '@angular/router';
import { AddCarComponent } from './add-car/add-car.component';
import { AllCarsComponent } from './all-cars/all-cars.component';
import { GuestGuard } from './auth/guest.guard';
import { CarDetailsComponent } from './car-details/car-details.component';
import { EditCarComponent } from './edit-car/edit-car.component';
import { HomepageComponent } from './homepage/homepage.component';
import { MapsComponent } from './maps/maps.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { Top10Component } from './top-10/top-10.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: HomepageComponent,
  },
  {
    path: 'find-us',
    component: MapsComponent,
  },
  {
    path: 'user',
    loadChildren: () => import('./auth/auth.module').then((m) => m.AuthModule),
  },
  {
    path: 'all-cars',
    component: AllCarsComponent,
  },
  {
    path: 'top-10',
    component: Top10Component,
  },
  {
    path: 'details/:id',
    component: CarDetailsComponent,
  },
  {
    path: 'add',
    component: AddCarComponent,
    canActivate: [GuestGuard],
  },
  {
    path: 'edit/:id',
    component: EditCarComponent,
    canActivate: [GuestGuard],
  },
  {
    path: '404',
    component: NotFoundComponent,
  },
  {
    path: '**',
    redirectTo: '404',
  },
];

export const AppRoutingModule = RouterModule.forRoot(routes);
