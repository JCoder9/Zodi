import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { ProductsService } from '../../services/products.service';
import { Product } from '../../models/product.model';

@Component({
  selector: 'zodi-brands',
  templateUrl: './brands.component.html',
  styleUrls: ['./brands.component.scss'],
})
export class BrandsComponent implements OnInit, OnDestroy {
  endSubs$: Subject<void> = new Subject();
  products: Product[] = [];
  brands: string[] = [];
  selectedBrand = '';
  filteredProducts: Product[] = [];
  loading = true;

  // Brand logo mapping
  brandLogos: { [key: string]: string } = {
    'Zodi': 'https://logo.clearbit.com/nike.com?size=200',
    'Nike': 'https://logos-world.net/wp-content/uploads/2020/04/Nike-Logo.png',
    'Adidas': 'https://logos-world.net/wp-content/uploads/2020/04/Adidas-Logo.png',
    'Gucci': 'https://logos-world.net/wp-content/uploads/2020/04/Gucci-Logo.png',
    'Prada': 'https://logos-world.net/wp-content/uploads/2020/04/Prada-Logo.png',
    'Louis Vuitton': 'https://logos-world.net/wp-content/uploads/2020/04/Louis-Vuitton-Logo.png',
    'Chanel': 'https://logos-world.net/wp-content/uploads/2020/04/Chanel-Logo.png',
    'Coach': 'https://logos-world.net/wp-content/uploads/2020/04/Coach-Logo.png',
    'Michael Kors': 'https://logos-world.net/wp-content/uploads/2020/04/Michael-Kors-Logo.png',
    'Jimmy Choo': 'https://logos-world.net/wp-content/uploads/2020/04/Jimmy-Choo-Logo.png',
    'Converse': 'https://logos-world.net/wp-content/uploads/2020/04/Converse-Logo.png',
    'Dr. Martens': 'https://www.drmartens.com/on/demandware.static/Sites-GB-Site/-/default/dw3c8b4c6b/images/logos/logo.svg',
    'YSL': 'https://logos-world.net/wp-content/uploads/2020/04/Yves-Saint-Laurent-Logo.png',
    'Saint Laurent': 'https://logos-world.net/wp-content/uploads/2020/04/Yves-Saint-Laurent-Logo.png',
    'Dior': 'https://logos-world.net/wp-content/uploads/2020/04/Dior-Logo.png',
    'Kate Spade': 'https://logos-world.net/wp-content/uploads/2020/04/Kate-Spade-Logo.png',
    'Marc Jacobs': 'https://logos-world.net/wp-content/uploads/2020/04/Marc-Jacobs-Logo.png',
    'Tory Burch': 'https://logos-world.net/wp-content/uploads/2020/04/Tory-Burch-Logo.png',
    'Cole Haan': 'https://logo.clearbit.com/colehaan.com?size=200',
    'Zara': 'https://logos-world.net/wp-content/uploads/2020/04/Zara-Logo.png',
    'Vans': 'https://logos-world.net/wp-content/uploads/2020/04/Vans-Logo.png',
    'Alexander Wang': 'https://logo.clearbit.com/alexanderwang.com?size=200',
    'Castaner': 'https://logo.clearbit.com/castaner.com?size=200',
    'Repetto': 'https://logo.clearbit.com/repetto.com?size=200',
    'Christian Louboutin': 'https://logo.clearbit.com/christianlouboutin.com?size=200',
    'Nicholas Kirkwood': 'https://logo.clearbit.com/nicholaskirkwood.com?size=200',
    'Manolo Blahnik': 'https://logo.clearbit.com/manoloblahnik.com?size=200',
    'Stella McCartney': 'https://logo.clearbit.com/stellamccartney.com?size=200',
    'Mansur Gavriel': 'https://logo.clearbit.com/mansurgavriel.com?size=200',
    'Rebecca Minkoff': 'https://logo.clearbit.com/rebeccaminkoff.com?size=200',
    'Henri Bendel': 'https://logo.clearbit.com/henribendel.com?size=200',
    'Cult Gaia': 'https://logo.clearbit.com/cultgaia.com?size=200',
    'Jacquemus': 'https://logo.clearbit.com/jacquemus.com?size=200',
    'L.L.Bean': 'https://logos-world.net/wp-content/uploads/2020/04/LL-Bean-Logo.png',
    'Stuart Weitzman': 'https://logo.clearbit.com/stuartweitzman.com?size=200',
    'Acne Studios': 'https://logo.clearbit.com/acnestudios.com?size=200'
  };

  constructor(private productsService: ProductsService) {}

  ngOnInit(): void {
    this._getProducts();
  }

  ngOnDestroy(): void {
    this.endSubs$.next();
    this.endSubs$.complete();
  }

  private _getProducts() {
    this.productsService
      .getProducts()
      .pipe(takeUntil(this.endSubs$))
      .subscribe((products) => {
        this.products = products;
        this.filteredProducts = products;
        this._extractBrands();
        this.loading = false;
      });
  }

  private _extractBrands() {
    const brandSet = new Set<string>();
    this.products.forEach((product) => {
      if (product.brand) {
        brandSet.add(product.brand);
      }
    });
    this.brands = Array.from(brandSet).sort();
  }

  filterByBrand(brand: string) {
    this.selectedBrand = brand;
    if (brand) {
      this.filteredProducts = this.products.filter(
        (product) => product.brand === brand
      );
    } else {
      this.filteredProducts = this.products;
    }
  }

  getBrandLogo(brandName: string): string {
    return this.brandLogos[brandName] || 'https://via.placeholder.com/80x80?text=' + encodeURIComponent(brandName);
  }

  getProductCountForBrand(brand: string): number {
    return this.products.filter(product => product.brand === brand).length;
  }
}
