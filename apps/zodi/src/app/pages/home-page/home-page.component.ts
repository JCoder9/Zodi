import { Component } from '@angular/core';

interface Brand {
  name: string;
  logo: string;
}

@Component({
  selector: 'zodi-home-page',
  templateUrl: './home-page.component.html',
  styles: [`
    .home {
      min-height: 100vh;
    }

    .hero-banner {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 80px 20px;
      text-align: center;
      margin-bottom: 40px;
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
      background: #f8f9fa;
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
      box-shadow: 0 8px 25px rgba(0,0,0,0.15);
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
      background: white;
    }

    .brands-showcase {
      padding: 40px 20px;
      background: #f8f9fa;
    }

    .brands-container {
      max-width: 1200px;
      margin: 0 auto;
    }

    .brands-container h2 {
      text-align: center;
      margin-bottom: 30px;
      color: #333;
      font-weight: 500;
    }

    .brands-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 20px;
    }

    .brand-card {
      text-align: center;
      padding: 20px;
      transition: transform 0.3s ease;
    }

    .brand-card:hover {
      transform: scale(1.05);
    }

    .brand-logo {
      width: 80px;
      height: 80px;
      object-fit: contain;
      margin-bottom: 15px;
    }

    .brand-card h3 {
      margin: 0;
      color: #333;
      font-weight: 500;
    }

    .promo-banners {
      padding: 40px 20px;
      background: white;
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

    @media (max-width: 768px) {
      .hero-content h1 {
        font-size: 2rem;
      }

      .nav-grid {
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 15px;
      }

      .brands-grid {
        grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
        gap: 15px;
      }

      .promo-grid {
        grid-template-columns: 1fr;
        gap: 20px;
      }
    }
  `],
})
export class HomePageComponent {
  featuredBrands: Brand[] = [
    { 
      name: 'Zodi', 
      logo: 'https://logo.clearbit.com/nike.com?size=200' // Using Nike as placeholder for Zodi
    },
    { 
      name: 'Nike', 
      logo: 'https://logos-world.net/wp-content/uploads/2020/04/Nike-Logo.png'
    },
    { 
      name: 'Adidas', 
      logo: 'https://logos-world.net/wp-content/uploads/2020/04/Adidas-Logo.png'
    },
    { 
      name: 'Gucci', 
      logo: 'https://logos-world.net/wp-content/uploads/2020/04/Gucci-Logo.png'
    },
    { 
      name: 'Prada', 
      logo: 'https://logos-world.net/wp-content/uploads/2020/04/Prada-Logo.png'
    },
    { 
      name: 'Louis Vuitton', 
      logo: 'https://logos-world.net/wp-content/uploads/2020/04/Louis-Vuitton-Logo.png'
    },
    {
      name: 'Chanel',
      logo: 'https://logos-world.net/wp-content/uploads/2020/04/Chanel-Logo.png'
    },
    {
      name: 'Coach',
      logo: 'https://logos-world.net/wp-content/uploads/2020/04/Coach-Logo.png'
    },
    {
      name: 'Michael Kors',
      logo: 'https://logos-world.net/wp-content/uploads/2020/04/Michael-Kors-Logo.png'
    },
    {
      name: 'Jimmy Choo',
      logo: 'https://logos-world.net/wp-content/uploads/2020/04/Jimmy-Choo-Logo.png'
    },
    {
      name: 'Converse',
      logo: 'https://logos-world.net/wp-content/uploads/2020/04/Converse-Logo.png'
    },
    {
      name: 'Dr. Martens',
      logo: 'https://www.drmartens.com/on/demandware.static/Sites-GB-Site/-/default/dw3c8b4c6b/images/logos/logo.svg'
    }
  ];
}
