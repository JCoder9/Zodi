import { Component, OnInit, OnDestroy } from '@angular/core';
import { BrandsService, Brand, ProductsService, Product } from '@zodi/libs/products';
import { Subject, takeUntil, forkJoin } from 'rxjs';
import { Router } from '@angular/router';

interface BrandDisplay extends Brand {
  name: string;
  logo: string;
}

@Component({
  selector: 'zodi-home-page',
  templateUrl: './home-page.component.html',
  styles: [
    `
      .home {
        min-height: 100vh;
      }

      .hero-banner {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        padding: 80px 20px;
        text-align: center;
        margin-bottom: 40px;
        border-radius: 10px
      }

      .hero-content h1 {
        font-size: 3rem;
        margin-bottom: 20px;
        font-weight: 300;
      }

      .hero-content p {
        font-size: 1.2rem;
        margin-bottom: 30px;
        opacity: 0.9;
      }

      .quick-nav {
        padding: 40px 20px;
      }

      .nav-container {
        max-width: 1200px;
        margin: 0 auto;
      }

      .nav-container h2 {
        text-align: center;
        margin-bottom: 30px;
        color: #333;
        font-weight: 500;

      }

      .nav-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 20px;
        margin-bottom: 20px;
      }

      .nav-card {
        cursor: pointer;
        transition: transform 0.3s ease, box-shadow 0.3s ease;
        text-align: center;
      }

      .nav-card:hover {
        transform: translateY(-5px);
        box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
      }

      .nav-card mat-card-header {
        justify-content: center;
        padding-bottom: 10px;
      }

      .nav-card mat-icon {
        font-size: 2rem;
        width: 2rem;
        height: 2rem;
        margin-right: 10px;
      }

      .nav-card.sale {
        border-left: 4px solid #e53e3e;
      }

      .nav-card.sale mat-icon {
        color: #e53e3e;
      }

      .nav-card.clearance {
        border-left: 4px solid #ff6b35;
      }

      .nav-card.clearance mat-icon {
        color: #ff6b35;
      }

      .nav-card.new-in {
        border-left: 4px solid #38a169;
      }

      .nav-card.new-in mat-icon {
        color: #38a169;
      }

      .nav-card.brands {
        border-left: 4px solid #3182ce;
      }

      .nav-card.brands mat-icon {
        color: #3182ce;
      }

      .categories-section {
        padding: 40px 0;
        background: white;
        text-align: center;
      }

      .categories-container {
        max-width: 1200px;
        margin: 0 auto;
      }

      .categories-container h2 {
        text-align: center;
        margin-bottom: 30px;
        color: #333;
        font-weight: 500;
      }

      .categories-filter {
        display: flex;
        justify-content: center;
      }

      .categories-filter-button {
        display: flex;
        align-items: center;
        gap: 8px;
        min-width: 200px;
        justify-content: space-between;
        font-size: 16px;
        padding: 12px 24px;
      }

      .categories-content {
        width: 400px;
        max-height: 500px;
        overflow-y: auto;
        padding: 16px;
      }

      .category-section {
        margin-bottom: 16px;
      }

      .category-section h3 {
        margin: 0 0 12px 0;
        font-size: 14px;
        font-weight: 500;
        color: #666;
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }

      .category-list {
        display: flex;
        flex-direction: column;
        gap: 4px;
      }

      .category-list button {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 12px 16px;
        text-align: left;
        border-radius: 8px;
        transition: background-color 0.2s ease;
      }

      .category-list button:hover {
        background-color: #f5f5f5;
      }

      .category-list button mat-icon {
        font-size: 20px;
        width: 20px;
        height: 20px;
        color: #666;
      }

      .category-list button span {
        font-size: 14px;
        color: #333;
      }

      .featured-section {
        padding: 40px 20px;
      }

      .brands-showcase {
        padding: 60px 20px;
      }

      .brands-container {
        max-width: 1200px;
        margin: 0 auto;
      }

      .brands-container h2 {
        text-align: center;
        margin-bottom: 40px;
        color: #333;
        font-size: 2rem;
        font-weight: 500;
      }

      .brand-logos-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 2rem;
      }

      .brand-logo-card {
        text-align: center;
        padding: 1.5rem;
        border-radius: 12px;
        background: white;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        cursor: pointer;
        transition: all 0.3s ease;
        border: 2px solid transparent;
      }

      .brand-logo-card:hover {
        transform: translateY(-8px);
        box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15);
        border-color: #667eea;
      }

      .logo-container {
        margin-bottom: 1rem;
        display: flex;
        justify-content: center;
        align-items: center;
        height: 80px;
      }

      .brand-logo {
        max-width: 80px;
        max-height: 80px;
        object-fit: contain;
        filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
      }

      .brand-logo-card h4 {
        color: #333;
        font-size: 1.1rem;
        font-weight: 600;
        margin: 0 0 0.5rem 0;
      }

      .brand-logo-card p {
        color: #666;
        font-size: 0.9rem;
        margin: 0;
      }

      .loading-state {
        text-align: center;
        padding: 4rem 2rem;
        color: #666;
        font-size: 1.2rem;
      }

      .promo-banners {
        padding: 40px 20px;
      }

      .promo-container {
        max-width: 1200px;
        margin: 0 auto;
      }

      .promo-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 30px;
      }

      .promo-card {
        text-align: center;
        padding: 30px 20px;
      }

      .promo-card.seasonal {
        background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%);
      }

      .promo-card.exclusive {
        background: linear-gradient(135deg, #fce4ec 0%, #f8bbd9 100%);
      }

      .promo-card mat-icon {
        font-size: 2.5rem;
        width: 2.5rem;
        height: 2.5rem;
      }

      .coming-soon-badge {
        display: inline-block;
        padding: 8px 20px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        font-size: 0.95rem;
        font-weight: 600;
        border-radius: 25px;
        margin-top: 10px;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
      }

      @media (max-width: 768px) {
        .hero-content h1 {
          font-size: 2rem;
        }

        .nav-grid {
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 15px;
        }

        .brand-logos-grid {
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 1.5rem;
        }

        .promo-grid {
          grid-template-columns: 1fr;
          gap: 20px;
        }
      }
    `,
  ],
})
export class HomePageComponent implements OnInit, OnDestroy {
  featuredBrands: BrandDisplay[] = [];
  products: Product[] = [];
  loading = true;
  endSubs$: Subject<void> = new Subject();

  constructor(
    private brandsService: BrandsService,
    private productsService: ProductsService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this._loadFeaturedBrands();
  }

  ngOnDestroy(): void {
    this.endSubs$.next();
    this.endSubs$.complete();
  }

  private _loadFeaturedBrands() {
    forkJoin({
      brands: this.brandsService.getFeaturedBrands(),
      products: this.productsService.getProducts()
    })
      .pipe(takeUntil(this.endSubs$))
      .subscribe(({ brands, products }) => {
        this.featuredBrands = brands;
        this.products = products;
        this.loading = false;
      });
  }

  getProductCountForBrand(brandName: string): number {
    return this.products.filter((product) => product.brand === brandName).length;
  }

  onBrandClick(brandName: string) {
    this.router.navigate(['/brands'], { queryParams: { brand: brandName } });
  }
}
