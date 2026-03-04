import { Component, Input, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'zodi-cold-start-loader',
  templateUrl: './cold-start-loader.component.html',
  styleUrls: ['./cold-start-loader.component.scss'],
})
export class ColdStartLoaderComponent implements OnInit, OnDestroy {
  @Input() message = 'Loading products...';
  showColdStartMessage = false;
  private coldStartTimer: any;

  ngOnInit(): void {
    // Show cold start message after 3 seconds
    this.coldStartTimer = setTimeout(() => {
      this.showColdStartMessage = true;
    }, 3000);
  }

  ngOnDestroy(): void {
    if (this.coldStartTimer) {
      clearTimeout(this.coldStartTimer);
    }
  }
}
