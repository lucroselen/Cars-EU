import {
  NgModule,
  APP_INITIALIZER,
  CUSTOM_ELEMENTS_SCHEMA,
} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomepageComponent } from './homepage/homepage.component';
import { MapsComponent } from './maps/maps.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { AddCarComponent } from './add-car/add-car.component';
import { EditCarComponent } from './edit-car/edit-car.component';
import { AllCarsComponent } from './all-cars/all-cars.component';
import { CarDetailsComponent } from './car-details/car-details.component';
import { HeaderComponent } from './core/header/header.component';
import { FooterComponent } from './core/footer/footer.component';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { CoreModule } from './core/core.module';
import { AuthService } from './auth.service';
import { ReactiveFormsModule } from '@angular/forms';
import { Top10Component } from './top-10/top-10.component';
import { TrimPipe } from './trim.pipe';
import { NgxSpinnerModule } from 'ngx-spinner';

@NgModule({
  declarations: [
    AppComponent,
    HomepageComponent,
    MapsComponent,
    NotFoundComponent,
    AddCarComponent,
    EditCarComponent,
    AllCarsComponent,
    CarDetailsComponent,
    Top10Component,
    TrimPipe,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot({
      timeOut: 6000,
      closeButton: true,
      progressBar: true,
    }),
    AppRoutingModule,
    HttpClientModule,
    RouterModule,
    CoreModule.forRoot(),
    ReactiveFormsModule,
    NgxSpinnerModule,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: (authService: AuthService) => {
        return () =>
          localStorage.getItem('id') ? authService.authenticate() : null;
      },
      deps: [AuthService],
      multi: true,
    },
  ],
  bootstrap: [AppComponent, HeaderComponent, FooterComponent],
})
export class AppModule {}
