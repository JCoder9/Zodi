import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject, takeUntil, forkJoin } from 'rxjs';
import { ProductsService } from '../../services/products.service';
import { BrandsService } from '../../services/brands.service';
import { Product } from '../../models/product.model';
import { Brand } from '../../models/brand.model';

@Component({
  selector: 'zodi-brands',
  templateUrl: './brands.component.html',
  styleUrls: ['./brands.component.scss'],
})
export class BrandsComponent implements OnInit, OnDestroy {
  endSubs$: Subject<void> = new Subject();
  products: Product[] = [];
  brands: Brand[] = [];
  selectedBrand = '';
  filteredProducts: Product[] = [];
  loading = true;

  constructor(
    private productsService: ProductsService,
    private brandsService: BrandsService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this._loadData();
    
    // Check for brand query param
    this.route.queryParams.pipe(takeUntil(this.endSubs$)).subscribe(params => {
      if (params['brand'] && this.products.length > 0) {
        this.filterByBrand(params['brand']);
      }
    });
  }

  ngOnDestroy(): void {
    this.endSubs$.next();
    this.endSubs$.complete();
  }

  private _loadData() {
    forkJoin({
      brands: this.brandsService.getBrands(),
      products: this.productsService.getProducts()
    })
      .pipe(takeUntil(this.endSubs$))
      .subscribe(({ brands, products }) => {
        this.brands = brands;
        this.products = products;
        this.filteredProducts = products;
        this.loading = false;
        
        // Apply brand filter from query params if present
        const brandParam = this.route.snapshot.queryParams['brand'];
        if (brandParam) {
          this.filterByBrand(brandParam);
        }
      });
  }

  filterByBrand(brandName: string) {
    this.selectedBrand = brandName;
    if (brandName) {
      this.filteredProducts = this.products.filter(
        (product) => product.brand === brandName
      );
    } else {
      this.filteredProducts = this.products;
    }
  }

  getBrandLogo(brandName: string): string {
    const brand = this.brands.find(b => b.name === brandName);
    return brand?.logo || 'https://via.placeholder.com/80x80?text=' + encodeURIComponent(brandName);
  }

  getProductCountForBrand(brandName: string): number {
    return this.products.filter((product) => product.brand === brandName).length;
  }
}
