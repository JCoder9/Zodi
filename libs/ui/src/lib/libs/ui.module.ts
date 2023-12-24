import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BannerComponent } from './components/banner/banner.component';
import { ButtonModule } from 'primeng/button';
import { GalleryComponent } from './components/gallery/gallery.component';
import { LoadingOverlayComponent } from './components/loading-overlay/loading-overlay.component';
import { MapComponent } from './components/map/map.component';

@NgModule({
  imports: [CommonModule, ButtonModule],
  declarations: [
    BannerComponent,
    GalleryComponent,
    LoadingOverlayComponent,
    MapComponent,
  ],
  exports: [
    BannerComponent,
    GalleryComponent,
    LoadingOverlayComponent,
    MapComponent,
  ],
})
export class UiModule {}
