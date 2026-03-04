import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BannerComponent } from './components/banner/banner.component';
import { GalleryComponent } from './components/gallery/gallery.component';
import { LoadingOverlayComponent } from './components/loading-overlay/loading-overlay.component';
import { ColdStartLoaderComponent } from './components/cold-start-loader/cold-start-loader.component';
import { MapComponent } from './components/map/map.component';

@NgModule({
  imports: [CommonModule],
  declarations: [
    BannerComponent,
    GalleryComponent,
    LoadingOverlayComponent,
    ColdStartLoaderComponent,
    MapComponent,
  ],
  exports: [
    BannerComponent,
    GalleryComponent,
    LoadingOverlayComponent,
    ColdStartLoaderComponent,
    MapComponent,
  ],
})
export class UiModule {}
