import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { Product } from '../../models/product.model';
import { ProductsService } from '../../services/products.service';
import { CategoriesService } from '../../services/categories.service';
import { Category } from '../../models/category.model';

@Component({
  selector: 'zodi-mix-match',
  templateUrl: './mix-match.component.html',
  styles: [
    `
      .mix-match-page {
        padding: 0;
        margin: 0;
        min-height: 100vh;
        overflow: hidden;
        display: flex;
        flex-direction: column;
      }

      .page-header {
        display: none;
      }

      .main-layout {
        display: grid;
        grid-template-columns: 15vw 70vw 15vw;
        gap: 0;
        flex: 1;
        min-height: 0;
      }

      .left-carousel,
      .right-carousel {
        display: flex;
        flex-direction: column;
        min-height: 0;
        height: 100vh;
      }

      .center-display {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        padding: 30px;
        background: linear-gradient(135deg, #f8f9ff 0%, #ffffff 100%);
        height: 100vh;
        border-left: 1px solid #e3f2fd;
        border-right: 1px solid #e3f2fd;
      }

      .selected-items {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        width: 100%;
        flex: 1;
      }

      .selected-item {
        flex: 1;
      }

      .item-showcase {
        min-height: 60vh;

        text-align: center;
      }

      .showcase-image {
        object-fit: cover;
        border-radius: 12px;
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
        margin-bottom: 15px;
        transition: transform 0.3s ease;
        max-width: 30vw;
        height: 50vh;
        padding: 20px;
      }

      .showcase-image:hover {
        transform: scale(1.05);
      }

      .item-info h3 {
        margin: 0 0 8px 0;
        font-size: 18px;
        font-weight: 500;
        color: #333;
      }

      .item-info .price {
        margin: 0;
        font-size: 16px;
        font-weight: 600;
        color: #2c5aa0;
      }

      .empty-showcase {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        min-height: 280px;
        height: 100%;
        color: #999;
        border: 2px dashed #ddd;
        border-radius: 12px;
        background: rgba(255, 255, 255, 0.5);
        padding: 20px;
      }

      .empty-icon {
        font-size: 48px !important;
        width: 48px;
        height: 48px;
        margin-bottom: 12px;
        opacity: 0.6;
      }

      .empty-showcase p {
        margin: 0;
        font-size: 14px;
      }

      .action-section {
        margin-top: 30px;
        text-align: center;
        padding: 20px;
        background: white;
        border-radius: 12px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      }

      .actions {
        display: flex;
        gap: 15px;
        justify-content: center;
        align-items: center;
      }

      .add-both-btn,
      .save-combination-btn {
        min-width: 160px;
        font-size: 14px;
        padding: 10px 20px;
      }

      .carousel-header {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 10px;
        margin-bottom: 0;
        padding: 20px 15px;
        background: white;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        flex-shrink: 0;
      }

      .carousel-header h2 {
        margin: 0;
        font-weight: 500;
        color: #333;
        font-size: 16px;
      }

      .carousel-header mat-icon {
        font-size: 24px;
        width: 24px;
        height: 24px;
      }

      .product-carousel {
        flex: 1;
        min-height: 0;
        background: white;
        padding: 20px 15px;
      }

      .carousel-container {
        overflow-y: auto;
        height: 100%;
        padding-right: 10px;
      }

      .product-scroll {
        display: flex;
        flex-direction: column;
        gap: 15px;
        height: 100%;
      }

      .carousel-item {
        flex: 0 0 auto;
        cursor: pointer;
        transition: all 0.2s ease;
      }

      .carousel-item:hover {
        transform: translateX(5px);
      }

      .carousel-item.selected .product-card {
        border: 2px solid #3f51b5;
        box-shadow: 0 4px 16px rgba(63, 81, 181, 0.3);
        transform: scale(1.02);
      }

      .product-card {
        transition: all 0.2s ease;
        position: relative;
      }

      .card-image {
        position: relative;
        overflow: hidden;
      }

      .product-image {
        width: 100%;
        height: 120px;
        object-fit: cover;
      }

      .selection-overlay {
        position: absolute;
        top: 8px;
        right: 8px;
        background: #3f51b5;
        color: white;
        border-radius: 50%;
        width: 28px;
        height: 28px;
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 2;
      }

      .selection-overlay mat-icon {
        font-size: 16px;
        width: 16px;
        height: 16px;
      }

      .product-card mat-card-content {
        padding: 12px !important;
      }

      .product-card h4 {
        margin: 0 0 5px 0;
        font-size: 13px;
        font-weight: 500;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        line-height: 1.2;
      }

      .product-card .price {
        font-size: 14px;
        font-weight: 600;
        color: #2c5aa0;
        margin: 0;
      }

      /* Custom scrollbar for vertical carousels */
      .carousel-container::-webkit-scrollbar {
        width: 6px;
        height: 6px;
      }

      .carousel-container::-webkit-scrollbar-track {
        background: #f1f1f1;
        border-radius: 3px;
      }

      .carousel-container::-webkit-scrollbar-thumb {
        background: #888;
        border-radius: 3px;
      }

      .carousel-container::-webkit-scrollbar-thumb:hover {
        background: #555;
      }

      /* Horizontal scrolling for mobile */
      @media (max-width: 968px) {
        .carousel-container {
          scrollbar-width: thin;
          scrollbar-color: #888 #f1f1f1;
        }

        .product-scroll {
          -webkit-overflow-scrolling: touch;
        }
      }

      @media (max-width: 1200px) {
        .main-layout {
          grid-template-columns: 180px 1fr 180px;
        }

        .showcase-image {
          max-width: 35vw;
          height: 45vh;
        }
      }

      @media (max-width: 968px) {
        .mix-match-page {
          height: auto;
          overflow: auto;
        }

        .main-layout {
          display: flex;
          flex-direction: column;
          height: auto;
          gap: 0;
        }

        .left-carousel {
          order: 1;
          height: auto;
          min-height: 250px;
          border-bottom: 1px solid #e3f2fd;
        }

        .center-display {
          order: 2;
          padding: 20px 15px;
          height: auto;
          min-height: auto;
          border: none;
          border-top: 1px solid #e3f2fd;
          border-bottom: 1px solid #e3f2fd;
          background: linear-gradient(135deg, #f8f9ff 0%, #ffffff 100%);
        }

        .right-carousel {
          order: 3;
          height: auto;
          min-height: 250px;
          border-top: 1px solid #e3f2fd;
        }

        .selected-items {
          flex-direction: column;
          gap: 30px;
        }

        .selected-item {
          width: 100%;
        }

        .item-showcase {
          min-height: auto;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }

        .showcase-image {
          max-width: 80vw;
          height: auto;
          max-height: 350px;
          width: auto;
        }

        .empty-showcase {
          min-height: 200px;
          width: 100%;
        }

        .product-carousel {
          padding: 15px;
        }

        .carousel-container {
          height: 180px;
          overflow-x: auto;
          overflow-y: visible;
        }

        .product-scroll {
          flex-direction: row;
          gap: 15px;
          height: auto;
          padding-bottom: 10px;
        }

        .carousel-item {
          flex: 0 0 160px;
        }

        .product-image {
          height: 120px;
        }

        .actions {
          flex-direction: column;
          gap: 12px;
        }

        .add-both-btn,
        .save-combination-btn {
          width: 100%;
          max-width: 300px;
        }
      }

      @media (max-width: 768px) {
        .center-display {
          padding: 15px 10px;
        }

        .selected-items {
          gap: 25px;
        }

        .showcase-image {
          max-width: 90vw;
          max-height: 300px;
        }

        .carousel-container {
          height: 160px;
        }

        .carousel-item {
          flex: 0 0 140px;
        }

        .product-image {
          height: 100px;
        }

        .product-card h4 {
          font-size: 12px;
        }

        .product-card .price {
          font-size: 13px;
        }
      }

      @media (max-width: 480px) {
        .carousel-header h2 {
          font-size: 14px;
        }

        .carousel-header {
          padding: 15px 10px;
        }

        .product-carousel {
          padding: 10px;
        }

        .carousel-container {
          height: 140px;
        }

        .carousel-item {
          flex: 0 0 120px;
        }

        .product-image {
          height: 85px;
        }

        .showcase-image {
          max-height: 250px;
          max-width: 95vw;
        }

        .empty-showcase {
          min-height: 180px;
        }

        .empty-icon {
          font-size: 38px !important;
          width: 38px;
          height: 38px;
        }

        .item-info h3 {
          font-size: 16px;
        }

        .item-info .price {
          font-size: 14px;
        }

        .action-section {
          padding: 15px;
          margin-top: 20px;
        }

        .add-both-btn,
        .save-combination-btn {
          font-size: 13px;
          min-width: 140px;
        }
      }

      @media (max-height: 700px) {
        .showcase-image {
          max-height: 300px;
        }

        .action-section {
          margin-top: 15px;
          padding: 15px;
        }
      }
    `,
  ],
})
export class MixMatchComponent implements OnInit, OnDestroy {
  endSubs$: Subject<void> = new Subject();

  // Selected products for the two galleries
  selectedShoe: Product | null = null;
  selectedBag: Product | null = null;

  // Product collections
  shoeProducts: Product[] = [];
  bagProducts: Product[] = [];

  // Categories
  categories: Category[] = [];
  shoeCategory: Category | null = null;
  bagCategory: Category | null = null;

  // Carousel settings
  carouselOptions = {
    responsiveOptions: [
      {
        breakpoint: '1024px',
        numVisible: 4,
        numScroll: 1,
      },
      {
        breakpoint: '768px',
        numVisible: 3,
        numScroll: 1,
      },
      {
        breakpoint: '560px',
        numVisible: 2,
        numScroll: 1,
      },
    ],
  };

  constructor(
    private productsService: ProductsService,
    private categoriesService: CategoriesService
  ) {}

  ngOnInit(): void {
    this._getCategories();
  }

  ngOnDestroy(): void {
    this.endSubs$.next();
    this.endSubs$.complete();
  }

  private _getCategories() {
    this.categoriesService
      .getCategories()
      .pipe(takeUntil(this.endSubs$))
      .subscribe((categories) => {
        this.categories = categories;
        this._findProductCategories();
      });
  }

  private _findProductCategories() {
    // Find shoe and bag categories
    this.shoeCategory =
      this.categories.find(
        (cat) =>
          cat.name?.toLowerCase().includes('shoe') ||
          cat.name?.toLowerCase().includes('footwear') ||
          cat.name?.toLowerCase().includes('boot') ||
          cat.name?.toLowerCase().includes('sneaker')
      ) || null;

    this.bagCategory =
      this.categories.find(
        (cat) =>
          cat.name?.toLowerCase().includes('bag') ||
          cat.name?.toLowerCase().includes('handbag') ||
          cat.name?.toLowerCase().includes('purse') ||
          cat.name?.toLowerCase().includes('clutch') ||
          cat.name?.toLowerCase().includes('tote')
      ) || null;

    this._loadProducts();
  }

  private _loadProducts() {
    // Load all products and filter them
    this.productsService
      .getProducts()
      .pipe(takeUntil(this.endSubs$))
      .subscribe((products) => {
        // Filter shoes
        this.shoeProducts = products.filter(
          (product) =>
            product.name?.toLowerCase().includes('shoe') ||
            product.name?.toLowerCase().includes('boot') ||
            product.name?.toLowerCase().includes('sneaker') ||
            product.description?.toLowerCase().includes('shoe') ||
            product.description?.toLowerCase().includes('footwear') ||
            (this.shoeCategory && product.category === this.shoeCategory.id)
        );

        // Filter bags
        this.bagProducts = products.filter(
          (product) =>
            product.name?.toLowerCase().includes('bag') ||
            product.name?.toLowerCase().includes('handbag') ||
            product.name?.toLowerCase().includes('purse') ||
            product.name?.toLowerCase().includes('clutch') ||
            product.name?.toLowerCase().includes('tote') ||
            (this.bagCategory && product.category === this.bagCategory.id)
        );

        // Fallback: if no specific products found, split all products
        if (this.shoeProducts.length === 0) {
          this.shoeProducts = products.slice(0, Math.ceil(products.length / 2));
        }
        if (this.bagProducts.length === 0) {
          this.bagProducts = products.slice(Math.ceil(products.length / 2));
        }

        // Set default selections
        if (this.shoeProducts.length > 0) {
          this.selectedShoe = this.shoeProducts[0];
        }
        if (this.bagProducts.length > 0) {
          this.selectedBag = this.bagProducts[0];
        }
      });
  }

  // Handle shoe selection from carousel
  selectShoe(product: Product) {
    this.selectedShoe = product;
  }

  // Handle bag selection from carousel
  selectBag(product: Product) {
    this.selectedBag = product;
  }

  // Check if product is selected
  isShoeSelected(product: Product): boolean {
    return this.selectedShoe?.id === product.id;
  }

  isBagSelected(product: Product): boolean {
    return this.selectedBag?.id === product.id;
  }
}
