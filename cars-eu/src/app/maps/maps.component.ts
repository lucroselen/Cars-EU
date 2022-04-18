import { Component, OnInit } from '@angular/core';
import { Loader } from '@googlemaps/js-api-loader';
import { NotificationsService } from '../core/notifications.service';

@Component({
  selector: 'app-maps',
  templateUrl: './maps.component.html',
  styleUrls: ['./maps.component.css'],
})
export class MapsComponent implements OnInit {
  title = 'google-maps';
  private map: google.maps.Map;
  constructor(private notifications: NotificationsService) {}
  ngOnInit(): void {
    this.notifications.showInfo(
      'The pin shows our location. Feel free to visit us at any time!'
    );
    let loader = new Loader({
      apiKey: 'AIzaSyCfdy2keDRAnX2JJLw9WwIISXpheNlFHVA',
    });

    loader
      .load()
      .then(() => {
        this.map = new google.maps.Map(document.getElementById('map')!, {
          center: { lat: 42.63612256076243, lng: 23.36976168577798 },
          zoom: 12,
        });
      })
      .then(() => {
        new google.maps.Marker({
          position: { lat: 42.63612256076243, lng: 23.36976168577798 },
          map: this.map,
        });
      });
  }
}
