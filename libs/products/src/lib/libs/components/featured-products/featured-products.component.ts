import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { Product } from '../../models/product.model';
import { ProductsService } from '../../services/products.service';

@Component({
  selector: 'zodi-featured-products',
  templateUrl: './featured-products.component.html',
  styles: [
    `
      .featured-products {
        padding: 40px 0;
        background: white;
      }

      .featured-header {
        margin-bottom: 30px;
        text-align: center;
      }

      .featured-header h3 {
        margin: 0;
        font-size: 28px;
        font-weight: 500;
        color: #333;
      }

      .products-scroll-container {
        position: relative;
        overflow: hidden;
      }

      .products-scroll {
        display: grid;
        grid-auto-flow: column;
        grid-auto-columns: calc(100% / 5);
        gap: 24px;
        overflow-x: auto;
        scroll-behavior: smooth;
        padding: 0 20px;
        scrollbar-width: none;
        -ms-overflow-style: none;
      }

      .products-scroll::-webkit-scrollbar {
        display: none;
      }

      .product-item {
        width: 100%;
        min-width: 0;
        display: flex;
        flex-direction: column;
      }

      .product-item zodi-product-item {
        width: 100%;
        height: 100%;
        display: block;
      }

      /* Medium screens - 3 products visible */
      @media (max-width: 1200px) {
        .products-scroll {
          grid-auto-columns: calc(100% / 3);
          gap: 20px;
        }
      }

      /* Small screens - 2 products visible */
      @media (max-width: 768px) {
        .products-scroll {
          grid-auto-columns: calc(100% / 2);
          gap: 15px;
          padding: 0 15px;
        }

        .featured-header h3 {
          font-size: 24px;
        }
      }

      /* Extra small screens */
      @media (max-width: 480px) {
        .products-scroll {
          gap: 12px;
          padding: 0 10px;
        }

        .featured-header h3 {
          font-size: 20px;
        }
      }
    `,
  ],
})
export class FeaturedProductsComponent implements OnInit, OnDestroy {
  featuredProducts: Product[] = [];
  endSubs$: Subject<void> = new Subject();
  constructor(private productsService: ProductsService) {}

  ngOnInit(): void {
    this._getFeaturedProducts();
  }

  ngOnDestroy(): void {
    this.endSubs$.next();
    this.endSubs$.complete();
  }
  private _getFeaturedProducts() {
    this.productsService
      .getFeaturedProducts(10)
      .pipe(takeUntil(this.endSubs$))
      .subscribe((products) => {
        this.featuredProducts = products;
      });
  }
}
