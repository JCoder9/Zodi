import { Component, OnInit, ViewChild } from '@angular/core';
import { MapInfoWindow, GoogleMap } from '@angular/google-maps';

@Component({
  selector: 'zodi-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss'],
})
export class ContactComponent implements OnInit {
  @ViewChild(GoogleMap, { static: false }) map!: GoogleMap;
  @ViewChild(MapInfoWindow, { static: false }) info!: MapInfoWindow;

  selectedSocialMedia: string | null = null;

  zoom = 19;
  center!: google.maps.LatLngLiteral;
  options: google.maps.MapOptions = {
    zoomControl: false,
    scrollwheel: false,
    disableDoubleClickZoom: true,
    // mapTypeId: 'hybrid',
    maxZoom: 20,
    minZoom: 8,
  };
  markers: any = [];
  infoContent = '';

  ngOnInit() {
    this.center = { lat: 54.272430218160835, lng: -8.478582887014712 };
    this.addMarker(this.center); // Call addMarker with the specific coordinates
    this.selectedSocialMedia = 'map';
  }

  zoomIn() {
    if (this.options.maxZoom && this.zoom < this.options.maxZoom) this.zoom++;
  }

  zoomOut() {
    if (this.options.minZoom && this.zoom > this.options.minZoom) this.zoom--;
  }

  addMarker(position: google.maps.LatLngLiteral) {
    this.markers.push({
      position: position,
      label: {
        color: 'red',
        text: 'Marker label ' + (this.markers.length + 1),
      },
      title: 'Marker title ' + (this.markers.length + 1),
      info: 'Marker info ' + (this.markers.length + 1),
      options: {
        animation: google.maps.Animation.BOUNCE,
      },
    });
  }

  getRightItemBackground(): string {
    if (this.selectedSocialMedia === 'instagram') {
      return 'url("instagram.png")';
    } else if (this.selectedSocialMedia === 'facebook') {
      return 'url("facebook.png")';
    } else {
      return '';
    }
  }
}
