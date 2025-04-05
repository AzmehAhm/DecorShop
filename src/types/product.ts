export interface Product {
  id: string;
  name: string;
  description: string;
  category: string;
  cost: number;
  isActive: boolean;
  imageUrl?: string;
  hasSizeModifier: boolean;
  hasColorModifier: boolean;
}

export interface ProductModifier {
  id: string;
  name: string;
  type: "size" | "color";
}

export interface ProductVariant {
  id: string;
  productId: string;
  sku: string;
  sizeId?: string;
  sizeName?: string;
  colorId?: string;
  colorName?: string;
  stockLevel: number;
  reorderPoint: number;
  price?: number; // Current price (from active price list)
}

export interface PriceList {
  id: string;
  name: string;
  description?: string;
  isDefault: boolean;
}

export interface PriceListItem {
  id: string;
  priceListId: string;
  productVariantId: string;
  price: number;
}

export interface ProductWithVariants extends Product {
  variants: ProductVariant[];
  availableSizes: ProductModifier[];
  availableColors: ProductModifier[];
}
