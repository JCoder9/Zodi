import { AfterViewInit, Component, ViewChild } from '@angular/core';
import * as L from 'leaflet';
@Component({
  selector: 'zodi-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss'],
})
export class ContactComponent implements AfterViewInit {
  // @ViewChild(GoogleMap, { static: false }) map!: GoogleMap;
  // @ViewChild(MapInfoWindow, { static: false }) info!: MapInfoWindow;

  selectedSocialMedia: string | null = null;

  zoom = 19;
  // center!: google.maps.LatLngLiteral;
  // options: google.maps.MapOptions = {
  //   zoomControl: false,
  //   scrollwheel: false,
  //   disableDoubleClickZoom: true,
  //   // mapTypeId: 'hybrid',
  //   maxZoom: 20,
  //   minZoom: 8,
  // };
  // markers: any = [];
  // infoContent = '';

  ngAfterViewInit() {
    this.initMap();
  }

  private initMap() {
    const icon = {
      icon: L.icon({
        iconSize: [25, 41],
        iconAnchor: [13, 0],
        iconUrl: './node_modules/leaflet/dist/images/marker-icon.png',
        shadowUrl: './node_modules/leaflet/dist/images/marker-shadow.png',
      }),
    };

    const map = L.map('map').setView(
      [54.272430218160835, -8.478582887014712],
      25
    );

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    const marker = L.marker(
      [54.272430218160835, -8.478582887014712],
      icon
    ).addTo(map);
  }
}
