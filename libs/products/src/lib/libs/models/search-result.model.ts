export type SearchResultType = 'product' | 'brand' | 'category' | 'color';

export type SearchResult =
  | {
      type: 'product';
      id: string;
      name: string;
      image?: string;
      brand?: string;
      colour?: string;
    }
  | {
      type: 'brand';
      name: string;
      image?: string;
    }
  | {
      type: 'category';
      name: string;
    }
  | {
      type: 'color';
      name: string;
    };
